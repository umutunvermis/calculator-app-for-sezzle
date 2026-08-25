package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func floatPtr(v float64) *float64 {
	return &v
}

func TestCalculateHandler(t *testing.T) {
	tests := []struct {
		name           string
		method         string
		payload        interface{}
		rawBody        string
		expectedStatus int
		expectedResult float64
		expectedError  string
	}{
		{
			name:           "Addition of two positive numbers",
			method:         http.MethodPost,
			payload:        CalcRequest{Operation: "add", A: 15, B: floatPtr(25)},
			expectedStatus: http.StatusOK,
			expectedResult: 40,
		},
		{
			name:           "Addition with floating point precision",
			method:         http.MethodPost,
			payload:        CalcRequest{Operation: "add", A: 0.1, B: floatPtr(0.2)},
			expectedStatus: http.StatusOK,
			expectedResult: 0.3,
		},
		{
			name:           "Subtraction",
			method:         http.MethodPost,
			payload:        CalcRequest{Operation: "subtract", A: 100, B: floatPtr(35.5)},
			expectedStatus: http.StatusOK,
			expectedResult: 64.5,
		},
		{
			name:           "Multiplication",
			method:         http.MethodPost,
			payload:        CalcRequest{Operation: "multiply", A: 7, B: floatPtr(8)},
			expectedStatus: http.StatusOK,
			expectedResult: 56,
		},
		{
			name:           "Division valid",
			method:         http.MethodPost,
			payload:        CalcRequest{Operation: "divide", A: 50, B: floatPtr(4)},
			expectedStatus: http.StatusOK,
			expectedResult: 12.5,
		},
		{
			name:           "Division by zero",
			method:         http.MethodPost,
			payload:        CalcRequest{Operation: "divide", A: 10, B: floatPtr(0)},
			expectedStatus: http.StatusBadRequest,
			expectedError:  "Cannot divide by zero.",
		},
		{
			name:           "Power operation",
			method:         http.MethodPost,
			payload:        CalcRequest{Operation: "power", A: 2, B: floatPtr(5)},
			expectedStatus: http.StatusOK,
			expectedResult: 32,
		},
		{
			name:           "Square root positive",
			method:         http.MethodPost,
			payload:        CalcRequest{Operation: "sqrt", A: 81},
			expectedStatus: http.StatusOK,
			expectedResult: 9,
		},
		{
			name:           "Square root negative",
			method:         http.MethodPost,
			payload:        CalcRequest{Operation: "sqrt", A: -9},
			expectedStatus: http.StatusBadRequest,
			expectedError:  "Cannot calculate square root of a negative number.",
		},
		{
			name:           "Percentage calculation",
			method:         http.MethodPost,
			payload:        CalcRequest{Operation: "percentage", A: 75},
			expectedStatus: http.StatusOK,
			expectedResult: 0.75,
		},
		{
			name:           "Missing operand B for binary operation",
			method:         http.MethodPost,
			payload:        CalcRequest{Operation: "add", A: 10},
			expectedStatus: http.StatusBadRequest,
			expectedError:  `Operand "b" is required for operation "add"`,
		},
		{
			name:           "Unsupported operation",
			method:         http.MethodPost,
			payload:        CalcRequest{Operation: "modulo", A: 10, B: floatPtr(3)},
			expectedStatus: http.StatusBadRequest,
			expectedError:  `Unsupported operation: "modulo"`,
		},
		{
			name:           "Invalid JSON payload",
			method:         http.MethodPost,
			rawBody:        `{ invalid json }`,
			expectedStatus: http.StatusBadRequest,
			expectedError:  "Invalid JSON payload",
		},
		{
			name:           "Method not allowed (GET)",
			method:         http.MethodGet,
			expectedStatus: http.StatusMethodNotAllowed,
		},
		{
			name:           "OPTIONS Preflight request",
			method:         http.MethodOptions,
			expectedStatus: http.StatusOK,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var body []byte
			var err error

			if tt.rawBody != "" {
				body = []byte(tt.rawBody)
			} else if tt.payload != nil {
				body, err = json.Marshal(tt.payload)
				if err != nil {
					t.Fatalf("Failed to marshal payload: %v", err)
				}
			}

			req := httptest.NewRequest(tt.method, "/api/calculate", bytes.NewBuffer(body))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()

			calculateHandler(w, req)

			resp := w.Result()
			defer resp.Body.Close()

			if resp.StatusCode != tt.expectedStatus {
				t.Errorf("expected status %d, got %d", tt.expectedStatus, resp.StatusCode)
			}

			if tt.method == http.MethodOptions || resp.StatusCode == http.StatusMethodNotAllowed {
				return
			}

			var calcResp CalcResponse
			if err := json.NewDecoder(resp.Body).Decode(&calcResp); err != nil {
				t.Fatalf("Failed to decode response: %v", err)
			}

			if tt.expectedError != "" {
				if calcResp.Error != tt.expectedError {
					t.Errorf("expected error %q, got %q", tt.expectedError, calcResp.Error)
				}
			} else {
				if calcResp.Result != tt.expectedResult {
					t.Errorf("expected result %v, got %v", tt.expectedResult, calcResp.Result)
				}
			}
		})
	}
}
