# COBOL Legacy Code Documentation

## Overview
This directory contains documentation for the student account management system implemented in COBOL. The system provides core functionality for managing student account balances including viewing, crediting, and debiting operations.

---

## COBOL Files

### 1. **main.cob** - MainProgram
**Purpose:** Entry point and user interface for the account management system.

**Key Functions:**
- Displays an interactive menu-driven interface
- Accepts user input to select operations (1-4)
- Routes user requests to the Operations program
- Manages program loop and exit conditions

**Business Rules:**
- Menu options are:
  - **1. View Balance** - Retrieve and display current account balance
  - **2. Credit Account** - Add funds to the account
  - **3. Debit Account** - Withdraw funds from the account
  - **4. Exit** - Terminate the program
- Program continues looping until user selects Exit (option 4)
- Invalid menu selections (outside 1-4) display an error message and prompt for re-entry
- Program terminates gracefully with "Goodbye!" message

**Variables:**
- `USER-CHOICE`: Stores user's menu selection (numeric 0-9)
- `CONTINUE-FLAG`: Controls program loop (YES/NO)

---

### 2. **data.cob** - DataProgram
**Purpose:** Data persistence layer for student account balance storage.

**Key Functions:**
- **READ operation:** Retrieves current account balance from storage
- **WRITE operation:** Persists updated balance to storage
- Acts as an interface between the Operations program and stored data

**Business Rules:**
- **Initial Balance:** Student accounts start with $1,000.00
- **Balance Format:** Numeric value with 6 digits and 2 decimal places (9(6)V99)
- **Storage Persistence:** Balance is maintained in `STORAGE-BALANCE` variable during program execution
- Data operations are atomic and validated before writing

**Variables:**
- `STORAGE-BALANCE`: Core account balance storage (initial value: 1000.00)
- `OPERATION-TYPE`: Specifies whether to READ or WRITE data
- `PASSED-OPERATION`: Receives operation type from calling program
- `BALANCE`: Linkage section variable for data transfer

**Data Transfer Protocol:**
- READ: Transfers storage balance to calling program
- WRITE: Accepts balance from calling program and updates storage

---

### 3. **operations.cob** - Operations
**Purpose:** Business logic handler for all account operations.

**Key Functions:**
- **TOTAL Operation:** Queries current balance via DataProgram and displays it
- **CREDIT Operation:** 
  - Prompts user for credit amount
  - Reads current balance
  - Adds credit amount to balance
  - Persists updated balance
  - Displays new balance confirmation
- **DEBIT Operation:**
  - Prompts user for debit amount
  - Reads current balance
  - Validates sufficient funds before processing
  - Deducts amount from balance if funds available
  - Persists updated balance
  - Displays new balance or insufficient funds error

**Business Rules:**
- **Overdraft Prevention:** Debit operations are rejected if requested amount exceeds current balance
- **Insufficient Funds Message:** "Insufficient funds for this debit." is displayed when debit cannot be processed
- **Credit Validation:** No limit on credit operations; any positive amount is accepted
- **Balance Integrity:** All balance changes are persisted immediately through DataProgram
- **Audit Trail:** Each operation confirms completion with updated balance display

**Variables:**
- `OPERATION-TYPE`: Type of operation (TOTAL, CREDIT, DEBIT)
- `AMOUNT`: User-entered transaction amount
- `FINAL-BALANCE`: Current account balance (defaults to 1000.00)
- `PASSED-OPERATION`: Receives operation code from MainProgram

**Operation Parameters:**
- 'TOTAL ' - View balance (6-char padded)
- 'CREDIT' - Credit transaction (6-char)
- 'DEBIT ' - Debit transaction (6-char padded)

---

## System Architecture

```
┌─────────────────────────────────────────┐
│        MainProgram (main.cob)           │
│     User Interface & Menu Logic         │
└────────────┬────────────────────────────┘
             │
             │ Routes operations
             ▼
┌─────────────────────────────────────────┐
│        Operations (operations.cob)      │
│     Business Logic & Transactions       │
└────────────┬────────────────────────────┘
             │
             │ Read/Write requests
             ▼
┌─────────────────────────────────────────┐
│        DataProgram (data.cob)           │
│     Data Persistence & Storage          │
└─────────────────────────────────────────┘
```

---

## Student Account Business Rules Summary

1. **Initial State:** Each student account begins with a $1,000.00 balance
2. **Credit Operations:** Unlimited deposits; any positive amount accepted
3. **Debit Operations:** 
   - Cannot exceed current balance
   - Transaction rejected if insufficient funds
   - No partial debits allowed
4. **Balance Precision:** All amounts tracked to cents (two decimal places)
5. **Operation Confirmation:** All successful transactions display the updated balance
6. **Error Handling:** Invalid operations result in user-friendly error messages, not program termination

---

## Modernization Opportunities

- Migrate to modern programming language (Java, C#, Python)
- Implement persistency layer (database instead of in-memory storage)
- Add transaction logging and audit trails
- Implement proper error handling and exception management
- Add input validation and security controls
- Convert to REST API or microservices architecture
- Implement unit tests and integration tests
- Add transaction history/reporting features
