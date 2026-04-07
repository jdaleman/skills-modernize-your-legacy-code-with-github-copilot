/**
 * Student Account Management System - Node.js Application
 * 
 * This application is a modernized version of the legacy COBOL system.
 * It preserves the original business logic, data integrity, and menu options.
 * 
 * Architecture:
 * - DataProgram: Data persistence layer (replaces data.cob)
 * - Operations: Business logic layer (replaces operations.cob)
 * - MainProgram: User interface and menu (replaces main.cob)
 */

const prompt = require('prompt-sync')({ sigint: true });

/**
 * DataProgram Class
 * Mimics the data.cob program
 * Handles data persistence and balance storage
 */
class DataProgram {
  constructor() {
    // STORAGE-BALANCE from original COBOL: PIC 9(6)V99 VALUE 1000.00
    this.storageBalance = 1000.00;
  }

  /**
   * READ operation from COBOL DataProgram
   * Returns current balance
   */
  read() {
    return this.storageBalance;
  }

  /**
   * WRITE operation from COBOL DataProgram
   * Updates balance storage
   * @param {number} balance - New balance to store
   */
  write(balance) {
    this.storageBalance = balance;
  }

  /**
   * Get current balance formatted to 2 decimal places
   */
  getFormattedBalance() {
    return this.storageBalance.toFixed(2);
  }
}

/**
 * Operations Class
 * Mimics the operations.cob program
 * Implements business logic for account operations
 */
class Operations {
  constructor(dataProgram) {
    this.dataProgram = dataProgram;
  }

  /**
   * TOTAL operation from COBOL - View Balance
   * Displays current account balance
   */
  viewBalance() {
    const balance = this.dataProgram.read();
    const formattedBalance = String(balance.toFixed(2)).padStart(10, '0');
    console.log(`Current balance: ${formattedBalance}`);
  }

  /**
   * CREDIT operation from COBOL - Credit Account
   * Prompts for credit amount and updates balance
   */
  creditAccount() {
    const amountInput = prompt('Enter credit amount: ');
    const amount = parseFloat(amountInput);

    if (isNaN(amount) || amount < 0) {
      console.log('Invalid amount. Please enter a positive number.');
      return;
    }

    // READ operation
    const currentBalance = this.dataProgram.read();

    // ADD amount to balance
    const newBalance = currentBalance + amount;

    // WRITE operation
    this.dataProgram.write(newBalance);

    const formattedBalance = String(newBalance.toFixed(2)).padStart(10, '0');
    console.log(`Amount credited. New balance: ${formattedBalance}`);
  }

  /**
   * DEBIT operation from COBOL - Debit Account
   * Prompts for debit amount and updates balance with overdraft prevention
   */
  debitAccount() {
    const amountInput = prompt('Enter debit amount: ');
    const amount = parseFloat(amountInput);

    if (isNaN(amount) || amount < 0) {
      console.log('Invalid amount. Please enter a positive number.');
      return;
    }

    // READ operation
    const currentBalance = this.dataProgram.read();

    // IF balance >= amount (overdraft prevention from COBOL)
    if (currentBalance >= amount) {
      // SUBTRACT amount from balance
      const newBalance = currentBalance - amount;

      // WRITE operation
      this.dataProgram.write(newBalance);

      const formattedBalance = String(newBalance.toFixed(2)).padStart(10, '0');
      console.log(`Amount debited. New balance: ${formattedBalance}`);
    } else {
      // ELSE insufficient funds
      console.log('Insufficient funds for this debit.');
    }
  }
}

/**
 * MainProgram Class
 * Mimics the main.cob program
 * Handles menu display and program flow
 */
class MainProgram {
  constructor() {
    this.dataProgram = new DataProgram();
    this.operations = new Operations(this.dataProgram);
    this.continueFlag = true;
  }

  /**
   * Display main menu options
   */
  displayMenu() {
    console.log('--------------------------------');
    console.log('Account Management System');
    console.log('1. View Balance');
    console.log('2. Credit Account');
    console.log('3. Debit Account');
    console.log('4. Exit');
    console.log('--------------------------------');
  }

  /**
   * Execute selected operation based on user choice
   * @param {number} choice - User's menu selection
   */
  executeOperation(choice) {
    switch (choice) {
      case 1:
        this.operations.viewBalance();
        break;
      case 2:
        this.operations.creditAccount();
        break;
      case 3:
        this.operations.debitAccount();
        break;
      case 4:
        this.continueFlag = false;
        break;
      default:
        console.log('Invalid choice, please select 1-4.');
    }
  }

  /**
   * Main program loop
   * PERFORM UNTIL CONTINUE-FLAG = 'NO' from COBOL
   */
  run() {
    while (this.continueFlag) {
      this.displayMenu();
      const userInput = prompt('Enter your choice (1-4): ');
      const userChoice = parseInt(userInput);

      this.executeOperation(userChoice);
    }

    console.log('Exiting the program. Goodbye!');
  }
}

/**
 * Application entry point
 */
function main() {
  const mainProgram = new MainProgram();
  mainProgram.run();
}

// Execute application
main();

module.exports = { DataProgram, Operations, MainProgram };
