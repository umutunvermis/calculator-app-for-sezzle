package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math"
	"net/http"
)

type CalcRequest struct {
	Operation string   `json:"operation"`
	A         float64  `json:"a"`
	B         *float64 `json:"b"`
}

type CalcResponse struct {
	Result float64 `json:"result,omitempty"`
	Error  string  `json:"error,omitempty"`
}

func calculateHandler(w http.ResponseWriter, r *http.Request) {
	// CORS headers for local development if frontend is on another port
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req CalcRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendError(w, http.StatusBadRequest, "Invalid JSON payload")
		return
	}

	var result float64
	var calcErr string

	switch req.Operation {
	case "add":
		if req.B == nil { calcErr = `Operand "b" is required for operation "add"` } else { result = req.A + *req.B }
	case "subtract":
		if req.B == nil { calcErr = `Operand "b" is required for operation "subtract"` } else { result = req.A - *req.B }
	case "multiply":
		if req.B == nil { calcErr = `Operand "b" is required for operation "multiply"` } else { result = req.A * *req.B }
	case "divide":
		if req.B == nil { 
			calcErr = `Operand "b" is required for operation "divide"` 
		} else if *req.B == 0 {
			calcErr = "Cannot divide by zero."
		} else { 
			result = req.A / *req.B 
		}
	case "power":
		if req.B == nil { calcErr = `Operand "b" is required for operation "power"` } else { result = math.Pow(req.A, *req.B) }
	case "sqrt":
		if req.A < 0 {
			calcErr = "Cannot calculate square root of a negative number."
		} else {
			result = math.Sqrt(req.A)
		}
	case "percentage":
		result = req.A / 100
	default:
		calcErr = fmt.Sprintf(`Unsupported operation: "%s"`, req.Operation)
	}

	if calcErr != "" {
		sendError(w, http.StatusBadRequest, calcErr)
		return
	}

	// Handle floating point precision issues simply
	result = math.Round(result*10000000000) / 10000000000

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(CalcResponse{Result: result})
}

func sendError(w http.ResponseWriter, code int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(CalcResponse{Error: message})
}

func main() {
	http.HandleFunc("/api/calculate", calculateHandler)

	port := ":8080"
	fmt.Printf("Go Backend microservice running on port %s\n", port)
	log.Fatal(http.ListenAndServe(port, nil))
}
