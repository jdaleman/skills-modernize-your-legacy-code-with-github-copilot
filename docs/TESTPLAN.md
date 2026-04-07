# Test Plan: Student Account Management System

**Project:** Student Account Management System Modernization  
**System:** COBOL Legacy Account Management Application  
**Test Plan Version:** 1.0  
**Date Created:** April 7, 2026  

---

## Overview

This test plan documents comprehensive test cases for the student account management system. The system manages student account balances with operations to view, credit, and debit accounts. This test plan will serve as the basis for creating unit and integration tests in the Node.js modernized version.

---

## Test Cases

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|---|---|---|---|---|---|---|---|
| TC001 | Application starts with main menu | System is compiled and ready to run | 1. Execute ./accountsystem | Main menu displays with options 1-4 | | | |
| TC002 | Initial account balance is $1,000.00 | Application has started | 1. From main menu, select option 1 (View Balance) | Display shows "Current balance: 001000.00" | | | |
| TC003 | Invalid menu choice displays error | Main menu is displayed | 1. Enter invalid choice (e.g., 5) | Error message "Invalid choice, please select 1-4." is displayed; menu redisplays | | | |
| TC004 | Invalid menu choice (letter) displays error | Main menu is displayed | 1. Enter non-numeric choice (e.g., 'A') | Error message displays; menu redisplays | | | |
| TC005 | Invalid menu choice (0) displays error | Main menu is displayed | 1. Enter 0 | Error message "Invalid choice, please select 1-4." is displayed | | | |
| TC006 | View balance operation (TOTAL) | Application has started with initial balance of $1,000.00 | 1. From main menu, select option 1 | Current balance of $1,000.00 displays correctly | | | |
| TC007 | Credit account with valid amount | Application has started with balance of $1,000.00 | 1. From main menu, select option 2 (Credit Account) 2. Enter credit amount: 500 | Amount is added to balance; display shows "Amount credited. New balance: 001500.00" | | | |
| TC008 | Credit account with $0.01 (minimum) | Application has started with balance of $1,000.00 | 1. Select option 2 (Credit Account) 2. Enter credit amount: 0.01 | Balance updated to $1,000.01; confirmation message displays | | | |
| TC009 | Credit account with large amount | Application has started with balance of $1,000.00 | 1. Select option 2 (Credit Account) 2. Enter credit amount: 999999 | Balance updated to $1,000,999.00; confirmation message displays | | | |
| TC010 | Multiple credit operations update balance correctly | Application has started with balance of $1,000.00 | 1. Select option 2, credit $300; confirm 2. Select option 2, credit $200; confirm 3. Select option 1 to view balance | Final balance displays as $1,500.00 | | | |
| TC011 | Debit account with valid amount (partial withdrawal) | Application has started with balance of $1,000.00 | 1. From main menu, select option 3 (Debit Account) 2. Enter debit amount: 300 | Amount is deducted from balance; display shows "Amount debited. New balance: 000700.00" | | | |
| TC012 | Debit account with exact balance amount | Application has started with balance of $1,000.00 | 1. Select option 3 (Debit Account) 2. Enter debit amount: 1000 | Balance becomes $0.00; confirmation message displays | | | |
| TC013 | Debit account rejects amount exceeding balance | Application has started with balance of $1,000.00 | 1. Select option 3 (Debit Account) 2. Enter debit amount: 1500 | Transaction rejected; error message "Insufficient funds for this debit." displays; balance remains $1,000.00 | | | |
| TC014 | Debit account with $0.01 more than balance | Application has started with balance of $1,000.00 | 1. Select option 3 (Debit Account) 2. Enter debit amount: 1000.01 | Transaction rejected; "Insufficient funds for this debit." message displays | | | |
| TC015 | Debit zero balance account is rejected | Application has started with balance of $0.00 (zero balance) | 1. Select option 3 (Debit Account) 2. Enter debit amount: 0.01 | Transaction rejected; "Insufficient funds for this debit." message displays | | | |
| TC016 | Debit with amount of $0.01 from $1,000.00 | Application has started with balance of $1,000.00 | 1. Select option 3 (Debit Account) 2. Enter debit amount: 0.01 | Balance updated to $999.99; confirmation message displays | | | |
| TC017 | Multiple debit operations update balance correctly | Application has started with balance of $1,000.00 | 1. Select option 3, debit $200; confirm 2. Select option 3, debit $300; confirm 3. Select option 1 to view balance | Final balance displays as $500.00 | | | |
| TC018 | Credit followed by debit updates balance correctly | Application has started with balance of $1,000.00 | 1. Select option 2, credit $500; confirm 2. Select option 3, debit $800; confirm 3. Select option 1 to view balance | Final balance displays as $700.00 | | | |
| TC019 | Debit followed by credit updates balance correctly | Application has started with balance of $1,000.00 | 1. Select option 3, debit $400; confirm 2. Select option 2, credit $600; confirm 3. Select option 1 to view balance | Final balance displays as $1,200.00 | | | |
| TC020 | Failed debit does not update balance | Application has started with balance of $1,000.00 | 1. Select option 3, debit $1500 (insufficient funds); confirm rejection 2. Select option 1 to view balance | Balance remains at $1,000.00; no deduction occurs | | | |
| TC021 | Balance precision maintained (two decimal places) | Application has started | 1. Select option 2, credit $100.50 2. Select option 1 to view balance | Balance displays as $1,100.50 with correct decimal precision | | | |
| TC022 | Multiple decimal transactions | Application has started with balance of $1,000.00 | 1. Select option 2, credit $50.25 2. Select option 3, debit $30.75 3. Select option 1 to view balance | Final balance displays as $1,019.50 | | | |
| TC023 | Exit option (4) terminates program | Main menu is displayed | 1. From main menu, select option 4 (Exit) | Display shows "Exiting the program. Goodbye!" and program terminates cleanly | | | |
| TC024 | Menu displays after each operation (not exit) | Operation (1-3) has completed | 1. Complete any operation except exit 2. Observe next display | Main menu redisplays with options 1-4 available for next selection | | | |
| TC025 | Balance persists across multiple menu cycles | Application has started | 1. Select option 2, credit $100 2. Select option 1 to view balance 3. Select option 2, credit $50 4. Select option 1 to view balance | Each viewing operation shows correct accumulated balance | | | |
| TC026 | Application handles maximum balance value | Application has started | 1. Select option 2, credit $999999 (maximum allowed) 2. Select option 1 to view balance | Balance displays correctly without overflow or error | | | |
| TC027 | Business rule: No overdraft allowed (boundary test) | Application has started with balance of $100.00 | 1. Select option 3, debit $100.00 (exact balance); confirm 2. Select option 3, debit $0.01; confirm rejection 3. Select option 1 to view balance | First debit succeeds (balance = $0.00); second debit rejected; final balance = $0.00 | | | |
| TC028 | Data integrity after multiple operations | Application has started with initial $1,000.00 | 1. Credit $250, debit $100, credit $75, debit $50 2. Calculate expected: 1000 + 250 - 100 + 75 - 50 = 1,175 3. Select option 1 to view balance | Display shows $1,175.00 matching calculation | | | |
| TC029 | Operation sequence: View → Credit → View → Debit → View | Application has started | 1. View balance 2. Credit $300 3. View balance 4. Debit $200 5. View balance | Each view displays correct balance after operations | | | |
| TC030 | Menu loop continues until exit selected | Application has started | 1. Select operation 1 2. Select operation 2 3. Select operation 3 4. Select operation 1 5. Select operation 4 | Menu displays after each operation (1-3); program exits on operation 4 | | | |

---

## Test Case Categories

### 1. Menu Navigation & Input Validation (TC001-TC006)
Tests for proper menu display, invalid choice handling, and application startup.

### 2. View Balance Operations (TC002, TC006)
Tests for the TOTAL operation displaying current account balance.

### 3. Credit Operations (TC007-TC010, TC022-TC023)
Tests for successful credit transactions, balance updates, and decimal precision.

### 4. Debit Operations (TC011-TC021)
Tests for successful debit transactions, overdraft prevention, insufficient funds validation, and boundary conditions.

### 5. Data Integrity & Persistence (TC024-TC030)
Tests for balance persistence across operations, multiple transaction sequences, and calculation accuracy.

---

## Boundary Test Values

| Scenario | Test Value | Rationale |
|---|---|---|
| Minimum credit amount | $0.01 | Smallest positive amount |
| Maximum credit amount | $999,999.99 | System limit (6 digits + 2 decimals) |
| Exact balance debit | Equal to current balance | Tests zero-balance state |
| Overdraft attempt | Balance + $0.01 | Boundary test for rejection |
| Zero balance debit | Any positive amount | Rejects when balance is $0.00 |

---

## Test Execution Notes

- **Pass Criteria:** All operations execute as expected with correct balance updates and error handling
- **Fail Criteria:** Balance incorrect, error messages not displayed, invalid transactions processed, or program crashes
- **Comments:** Document any discrepancies, unexpected behavior, or observations during execution
- **Regression:** Re-run critical tests (TC013, TC020, TC027) after any code changes

---

## Migration to Node.js Tests

This test plan will be used to create unit tests (individual function testing) and integration tests (full transaction flow) in the Node.js modernized version. Each test case should have a corresponding unit or integration test.

**Recommended Node.js Test Framework:** Jest or Mocha with Chai assertions

**Example mapping:**
- TC007 → Unit test for credit function
- TC013 → Unit test for overdraft prevention
- TC028 → Integration test for transaction sequence
