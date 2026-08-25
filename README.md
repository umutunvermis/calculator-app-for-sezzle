# Full-Stack Calculator

A full-stack calculator application featuring a React/TypeScript frontend and a Go microservice backend.

## Design Decisions & Assumptions

- **Architecture:** The application separates concerns into a clean presentation layer (React + Vite) and a robust backend REST API service (Go). 
- **Client-Server Flow:** The frontend serves purely as a presentation layer and state machine for building equations. All arithmetic operations (including `add`, `subtract`, `multiply`, `divide`, `power`, `sqrt`, and `percentage`) are strictly performed on the backend to fulfill the microservice requirements.
- **Precision:** A simple floating-point rounding strategy is used on the Go backend to avoid common math quirks.
- **UI/UX:** The interface is inspired by elegant, dark-themed hardware calculators, utilizing Tailwind CSS for styling and `lucide-react` for iconography. 

## Requirements Addressed

- **Functional Requirements:**
  - Addition, Subtraction, Multiplication, Division.
  - Optional operations: Exponentiation (x^y), Square Root (√x), Percentage (%).
  - Clean UI with error handling (e.g., division by zero).
  - Validation: API rejects invalid payloads and throws structured error responses.
- **Non-Functional Requirements:**
  - Responsive, mobile-friendly design.
  - Clean idiomatic React (functional components, hooks) and Go code.
  - Unit tests provided for the backend logic (table-driven Go tests).

## Setup & Running

You will need two terminal windows to run both the backend and frontend locally.

### 1. Start the Go Backend

```bash
cd backend-go
go run main.go
```
*The Go server will start on port `8080`.*

### 2. Start the React Frontend

Open a new terminal window at the project root. Ensure you have Node.js and npm installed.

```bash
npm install
npm run dev
```
*Vite will start the frontend on port `3000`. API requests to `/api/*` are automatically proxied to the Go backend 
at `http://localhost:8080`.*

## Running Tests

Run the Go unit tests with verbosity and coverage:
```bash
cd backend-go
go test -v ./...
```

## API Usage (REST)

### `POST /api/calculate`

Performs an arithmetic operation.

**Payload:**
```json
{
  "operation": "add",
  "a": 5,
  "b": 3
}
```

*Valid operations:* `add`, `subtract`, `multiply`, `divide`, `power`, `sqrt`, `percentage`.

**Success Response (200 OK):**
```json
{
  "result": 8
}
```

**Error Response (400 Bad Request):**
*Example: Division by zero*
```json
{
  "error": "Cannot divide by zero."
}
```
