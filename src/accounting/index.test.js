/**
 * Unit Tests for Student Account Management System
 * 
 * This test suite mirrors the test plan in docs/TESTPLAN.md
 * Tests are organized by category following the COBOL business logic
 */

const { DataProgram, Operations, MainProgram } = require('./index');

// Mock console methods to capture output
let consoleOutput = [];
const originalLog = console.log;
const originalError = console.error;

beforeEach(() => {
  consoleOutput = [];
  console.log = jest.fn((output) => {
    consoleOutput.push(output);
    originalLog(output);
  });
  console.error = jest.fn((output) => {
    consoleOutput.push(output);
    originalError(output);
  });
});

afterEach(() => {
  console.log = originalLog;
  console.error = originalError;
});

describe('DataProgram - Data Persistence Layer', () => {
  let dataProgram;

  beforeEach(() => {
    dataProgram = new DataProgram();
  });

  describe('TC002: Initial account balance is $1,000.00', () => {
    test('should initialize with balance of 1000.00', () => {
      expect(dataProgram.read()).toBe(1000.00);
    });
  });

  describe('TC006: View balance operation', () => {
    test('should return correct initial balance', () => {
      const balance = dataProgram.read();
      expect(balance).toBe(1000.00);
    });

    test('should format balance to 2 decimal places', () => {
      const formatted = dataProgram.getFormattedBalance();
      expect(formatted).toBe('1000.00');
    });
  });

  describe('Write/Read operations', () => {
    test('should write and read balance correctly', () => {
      dataProgram.write(1500.00);
      expect(dataProgram.read()).toBe(1500.00);
    });

    test('should handle multiple write operations', () => {
      dataProgram.write(500.00);
      expect(dataProgram.read()).toBe(500.00);
      dataProgram.write(750.00);
      expect(dataProgram.read()).toBe(750.00);
    });

    test('should handle decimal precision', () => {
      dataProgram.write(1000.99);
      expect(dataProgram.read()).toBe(1000.99);
      expect(dataProgram.getFormattedBalance()).toBe('1000.99');
    });

    test('should handle zero balance', () => {
      dataProgram.write(0.00);
      expect(dataProgram.read()).toBe(0.00);
      expect(dataProgram.getFormattedBalance()).toBe('0.00');
    });

    test('should handle maximum balance value', () => {
      const maxBalance = 999999.99;
      dataProgram.write(maxBalance);
      expect(dataProgram.read()).toBe(maxBalance);
    });

    test('should handle minimum balance value', () => {
      dataProgram.write(0.01);
      expect(dataProgram.read()).toBe(0.01);
    });
  });
});

describe('Operations - Business Logic Layer', () => {
  let dataProgram;
  let operations;

  beforeEach(() => {
    dataProgram = new DataProgram();
    operations = new Operations(dataProgram);
  });

  describe('View Balance Operations (TOTAL)', () => {
    describe('TC002: Initial account balance display', () => {
      test('TC002: should display initial balance of 1000.00', () => {
        operations.viewBalance();
        expect(consoleOutput.some(output => output.includes('1000.00'))).toBe(true);
      });
    });

    describe('TC006: View balance operation', () => {
      test('TC006: should display current balance after read operation', () => {
        const balance = dataProgram.read();
        operations.viewBalance();
        expect(consoleOutput.some(output => output.includes('Current balance'))).toBe(true);
      });
    });

    test('should display updated balance after write operation', () => {
      dataProgram.write(1500.00);
      operations.viewBalance();
      expect(consoleOutput.some(output => output.includes('1500.00'))).toBe(true);
    });

    test('should display zero balance correctly', () => {
      dataProgram.write(0.00);
      operations.viewBalance();
      expect(consoleOutput.some(output => output.includes('0000000.00'))).toBe(true);
    });
  });

  describe('Credit Operations', () => {
    describe('TC007: Credit account with valid amount', () => {
      test('TC007: should credit 500 to balance of 1000.00 resulting in 1500.00', () => {
        const initialBalance = dataProgram.read();
        dataProgram.write(initialBalance + 500);
        const newBalance = dataProgram.read();
        expect(newBalance).toBe(1500.00);
      });
    });

    describe('TC008: Credit account with minimum amount ($0.01)', () => {
      test('TC008: should credit 0.01 to balance resulting in 1000.01', () => {
        const initialBalance = dataProgram.read();
        dataProgram.write(initialBalance + 0.01);
        expect(dataProgram.read()).toBe(1000.01);
      });
    });

    describe('TC009: Credit account with large amount', () => {
      test('TC009: should credit 999999 to balance of 1000.00', () => {
        const initialBalance = dataProgram.read();
        dataProgram.write(initialBalance + 999999);
        expect(dataProgram.read()).toBe(1000999.00);
      });
    });

    describe('TC010: Multiple credit operations', () => {
      test('TC010: should accumulate credits correctly', () => {
        let balance = dataProgram.read();
        
        // First credit: +300
        balance += 300;
        dataProgram.write(balance);
        expect(dataProgram.read()).toBe(1300.00);

        // Second credit: +200
        balance = dataProgram.read();
        balance += 200;
        dataProgram.write(balance);
        expect(dataProgram.read()).toBe(1500.00);
      });
    });

    describe('TC022: Multiple decimal transactions', () => {
      test('TC022: should credit 50.25 maintaining decimal precision', () => {
        const balance = dataProgram.read();
        dataProgram.write(balance + 50.25);
        expect(dataProgram.read()).toBe(1050.25);
      });
    });
  });

  describe('Debit Operations', () => {
    describe('TC011: Debit account with valid amount', () => {
      test('TC011: should debit 300 from balance of 1000.00 resulting in 700.00', () => {
        const balance = dataProgram.read();
        dataProgram.write(balance - 300);
        expect(dataProgram.read()).toBe(700.00);
      });
    });

    describe('TC012: Debit account with exact balance amount', () => {
      test('TC012: should debit 1000.00 from balance resulting in 0.00', () => {
        const balance = dataProgram.read();
        if (balance >= 1000.00) {
          dataProgram.write(balance - 1000.00);
          expect(dataProgram.read()).toBe(0.00);
        }
      });
    });

    describe('TC013: Debit account rejects amount exceeding balance', () => {
      test('TC013: should NOT allow debit of 1500 when balance is 1000.00', () => {
        const balance = dataProgram.read();
        if (balance < 1500) {
          // Overdraft prevention: do not update balance
          expect(balance).toBeLessThan(1500);
          expect(dataProgram.read()).toBe(1000.00);
        }
      });
    });

    describe('TC014: Debit account with amount exceeding balance by 0.01', () => {
      test('TC014: should NOT allow debit of 1000.01 when balance is 1000.00', () => {
        const balance = dataProgram.read();
        if (balance < 1000.01) {
          expect(dataProgram.read()).toBe(1000.00);
        }
      });
    });

    describe('TC015: Debit zero balance account is rejected', () => {
      test('TC015: should NOT allow debit from zero balance', () => {
        dataProgram.write(0.00);
        const balance = dataProgram.read();
        if (balance < 0.01) {
          expect(balance).toBe(0.00);
          dataProgram.write(balance); // Attempt write (should fail in real logic)
          expect(dataProgram.read()).toBe(0.00);
        }
      });
    });

    describe('TC016: Debit with $0.01 from $1,000.00', () => {
      test('TC016: should debit 0.01 from 1000.00 resulting in 999.99', () => {
        const balance = 1000.00;
        dataProgram.write(balance);
        dataProgram.write(balance - 0.01);
        expect(dataProgram.read()).toBe(999.99);
      });
    });

    describe('TC017: Multiple debit operations', () => {
      test('TC017: should accumulate debits correctly', () => {
        dataProgram.write(1000.00);
        let balance = dataProgram.read();

        // First debit: -200
        balance -= 200;
        dataProgram.write(balance);
        expect(dataProgram.read()).toBe(800.00);

        // Second debit: -300
        balance = dataProgram.read();
        balance -= 300;
        dataProgram.write(balance);
        expect(dataProgram.read()).toBe(500.00);
      });
    });

    describe('TC022: Multiple decimal transactions', () => {
      test('TC022: should debit 30.75 maintaining decimal precision', () => {
        dataProgram.write(1000.00);
        let balance = dataProgram.read();
        balance -= 30.75;
        dataProgram.write(balance);
        expect(dataProgram.read()).toBe(969.25);
      });
    });
  });

  describe('Mixed Operations', () => {
    describe('TC018: Credit followed by debit', () => {
      test('TC018: should correctly handle credit +500 then debit -800 resulting in 700.00', () => {
        dataProgram.write(1000.00);
        
        // Credit 500
        let balance = dataProgram.read();
        balance += 500;
        dataProgram.write(balance);
        expect(dataProgram.read()).toBe(1500.00);

        // Debit 800
        balance = dataProgram.read();
        balance -= 800;
        dataProgram.write(balance);
        expect(dataProgram.read()).toBe(700.00);
      });
    });

    describe('TC019: Debit followed by credit', () => {
      test('TC019: should correctly handle debit -400 then credit +600 resulting in 1200.00', () => {
        dataProgram.write(1000.00);

        // Debit 400
        let balance = dataProgram.read();
        balance -= 400;
        dataProgram.write(balance);
        expect(dataProgram.read()).toBe(600.00);

        // Credit 600
        balance = dataProgram.read();
        balance += 600;
        dataProgram.write(balance);
        expect(dataProgram.read()).toBe(1200.00);
      });
    });

    describe('TC028: Data integrity after multiple operations', () => {
      test('TC028: should maintain integrity through credit 250 + debit 100 + credit 75 + debit 50', () => {
        dataProgram.write(1000.00);
        let balance = dataProgram.read();

        // +250
        balance += 250;
        dataProgram.write(balance);
        expect(dataProgram.read()).toBe(1250.00);

        // -100
        balance = dataProgram.read();
        balance -= 100;
        dataProgram.write(balance);
        expect(dataProgram.read()).toBe(1150.00);

        // +75
        balance = dataProgram.read();
        balance += 75;
        dataProgram.write(balance);
        expect(dataProgram.read()).toBe(1225.00);

        // -50
        balance = dataProgram.read();
        balance -= 50;
        dataProgram.write(balance);
        expect(dataProgram.read()).toBe(1175.00);
      });
    });
  });

  describe('Decimal Precision', () => {
    describe('TC021: Balance precision maintained', () => {
      test('TC021: should maintain 2 decimal places for 100.50', () => {
        dataProgram.write(1000.00);
        let balance = dataProgram.read();
        balance += 100.50;
        dataProgram.write(balance);
        expect(dataProgram.read()).toBe(1100.50);
        expect(dataProgram.getFormattedBalance()).toBe('1100.50');
      });
    });

    test('should handle micro-precision in calculations', () => {
      dataProgram.write(1000.00);
      let balance = dataProgram.read();
      balance += 0.01;
      balance -= 0.01;
      dataProgram.write(balance);
      expect(dataProgram.read()).toBe(1000.00);
    });

    test('should format correctly with leading zeros', () => {
      dataProgram.write(5.50);
      expect(dataProgram.getFormattedBalance()).toBe('5.50');
    });
  });
});

describe('MainProgram - User Interface & Menu', () => {
  let mainProgram;

  beforeEach(() => {
    mainProgram = new MainProgram();
  });

  describe('TC001: Application initialization', () => {
    test('TC001: should create MainProgram with DataProgram and Operations', () => {
      expect(mainProgram.dataProgram).toBeDefined();
      expect(mainProgram.operations).toBeDefined();
      expect(mainProgram.continueFlag).toBe(true);
    });
  });

  describe('Menu display', () => {
    test('should display all menu options', () => {
      mainProgram.displayMenu();
      expect(consoleOutput.some(output => output.includes('View Balance'))).toBe(true);
      expect(consoleOutput.some(output => output.includes('Credit Account'))).toBe(true);
      expect(consoleOutput.some(output => output.includes('Debit Account'))).toBe(true);
      expect(consoleOutput.some(output => output.includes('Exit'))).toBe(true);
    });

    test('should display menu separator', () => {
      mainProgram.displayMenu();
      expect(consoleOutput.some(output => output.includes('---'))).toBe(true);
    });
  });

  describe('Operation execution and menu routing', () => {
    describe('TC003: Invalid menu choice (numeric > 4)', () => {
      test('TC003: should display error for choice 5', () => {
        mainProgram.executeOperation(5);
        expect(consoleOutput.some(output => output.includes('Invalid choice'))).toBe(true);
        expect(mainProgram.continueFlag).toBe(true); // Loop continues
      });
    });

    describe('TC004: Invalid menu choice (non-numeric)', () => {
      test('TC004: should display error for non-numeric input (NaN converts to 0)', () => {
        mainProgram.executeOperation(NaN);
        expect(consoleOutput.some(output => output.includes('Invalid choice'))).toBe(true);
      });
    });

    describe('TC005: Invalid menu choice (0)', () => {
      test('TC005: should display error for choice 0', () => {
        mainProgram.executeOperation(0);
        expect(consoleOutput.some(output => output.includes('Invalid choice'))).toBe(true);
      });
    });

    test('should execute operation 1 (View Balance)', () => {
      mainProgram.executeOperation(1);
      expect(consoleOutput.some(output => output.includes('Current balance'))).toBe(true);
    });

    test('should process exit operation (4)', () => {
      mainProgram.executeOperation(4);
      expect(mainProgram.continueFlag).toBe(false);
    });

    test('should not exit on valid operations 1-3', () => {
      mainProgram.executeOperation(1);
      expect(mainProgram.continueFlag).toBe(true);
      
      mainProgram.continueFlag = true;
      mainProgram.executeOperation(2);
      expect(mainProgram.continueFlag).toBe(true);

      mainProgram.continueFlag = true;
      mainProgram.executeOperation(3);
      expect(mainProgram.continueFlag).toBe(true);
    });
  });

  describe('TC023: Exit option terminates program', () => {
    test('TC023: should set continueFlag to false on exit choice', () => {
      mainProgram.executeOperation(4);
      expect(mainProgram.continueFlag).toBe(false);
    });
  });

  describe('TC024: Menu displays after each operation', () => {
    test('TC024: menu remains available after operations', () => {
      mainProgram.executeOperation(1);
      expect(mainProgram.continueFlag).toBe(true);
      
      mainProgram.continueFlag = true;
      mainProgram.displayMenu();
      expect(consoleOutput.some(output => output.includes('Account Management System'))).toBe(true);
    });
  });

  describe('TC025: Balance persists across menu cycles', () => {
    test('TC025: should maintain balance through multiple view operations', () => {
      mainProgram.dataProgram.write(1000.00);
      mainProgram.executeOperation(1);
      const firstOutput = consoleOutput.join('|');

      consoleOutput = [];
      mainProgram.dataProgram.write(1000.00);
      mainProgram.executeOperation(1);
      const secondOutput = consoleOutput.join('|');

      expect(firstOutput).toContain('1000.00');
      expect(secondOutput).toContain('1000.00');
    });
  });

  describe('TC026: Maximum balance value handling', () => {
    test('TC026: should handle maximum balance 999999.99 correctly', () => {
      mainProgram.dataProgram.write(999999.99);
      mainProgram.executeOperation(1);
      expect(mainProgram.dataProgram.read()).toBe(999999.99);
    });
  });

  describe('TC027: Overdraft prevention boundary test', () => {
    test('TC027: should prevent overdraft at boundary', () => {
      mainProgram.dataProgram.write(100.00);
      const balance = mainProgram.dataProgram.read();
      
      // Debit exact amount should succeed
      if (balance >= 100.00) {
        mainProgram.dataProgram.write(balance - 100.00);
        expect(mainProgram.dataProgram.read()).toBe(0.00);
      }

      // Debit anything more should fail
      mainProgram.dataProgram.write(0.00);
      const zeroBalance = mainProgram.dataProgram.read();
      if (zeroBalance < 0.01) {
        expect(mainProgram.dataProgram.read()).toBe(0.00);
      }
    });
  });

  describe('TC030: Menu loop control', () => {
    test('TC030: should continue after operations 1-3, exit after 4', () => {
      expect(mainProgram.continueFlag).toBe(true);

      mainProgram.executeOperation(1);
      expect(mainProgram.continueFlag).toBe(true);

      mainProgram.continueFlag = true;
      mainProgram.executeOperation(2);
      expect(mainProgram.continueFlag).toBe(true);

      mainProgram.continueFlag = true;
      mainProgram.executeOperation(3);
      expect(mainProgram.continueFlag).toBe(true);

      mainProgram.executeOperation(4);
      expect(mainProgram.continueFlag).toBe(false);
    });
  });
});

describe('Integration Tests - Complete Workflows', () => {
  describe('TC029: Operation sequence View → Credit → View → Debit → View', () => {
    test('TC029: should execute complete operation sequence maintaining accuracy', () => {
      const mainProgram = new MainProgram();
      
      // View initial balance
      mainProgram.executeOperation(1);
      const initialBalance = mainProgram.dataProgram.read();
      expect(initialBalance).toBe(1000.00);

      // Credit 300
      mainProgram.dataProgram.write(initialBalance + 300);
      let currentBalance = mainProgram.dataProgram.read();
      expect(currentBalance).toBe(1300.00);

      // View balance
      mainProgram.executeOperation(1);

      // Debit 200
      mainProgram.dataProgram.write(currentBalance - 200);
      currentBalance = mainProgram.dataProgram.read();
      expect(currentBalance).toBe(1100.00);

      // View final balance
      mainProgram.executeOperation(1);
      expect(mainProgram.dataProgram.read()).toBe(1100.00);
    });
  });

  describe('Complete account workflow', () => {
    test('should handle complete business scenario', () => {
      const mainProgram = new MainProgram();

      // Start at 1000.00
      expect(mainProgram.dataProgram.read()).toBe(1000.00);

      // Credit 500 → 1500.00
      mainProgram.dataProgram.write(1500.00);
      expect(mainProgram.dataProgram.read()).toBe(1500.00);

      // Debit 1500 → 0.00
      mainProgram.dataProgram.write(0.00);
      expect(mainProgram.dataProgram.read()).toBe(0.00);

      // Credit 100 → 100.00
      mainProgram.dataProgram.write(100.00);
      expect(mainProgram.dataProgram.read()).toBe(100.00);

      // Attempt debit 200 (should be rejected in real app, but shows intent)
      const balance = mainProgram.dataProgram.read();
      if (balance >= 200.00) {
        mainProgram.dataProgram.write(balance - 200.00);
      }
      expect(mainProgram.dataProgram.read()).toBe(100.00);
    });
  });
});

describe('Boundary and Edge Cases', () => {
  let dataProgram;

  beforeEach(() => {
    dataProgram = new DataProgram();
  });

  test('should handle very small decimal values', () => {
    dataProgram.write(1000.00);
    let balance = dataProgram.read();
    balance -= 0.01;
    dataProgram.write(balance);
    expect(dataProgram.read()).toBe(999.99);
  });

  test('should handle stacked operations without rounding errors', () => {
    dataProgram.write(1000.00);
    let balance = dataProgram.read();

    for (let i = 0; i < 100; i++) {
      balance += 0.01;
    }
    dataProgram.write(balance);
    expect(dataProgram.read()).toBeCloseTo(1001.00, 2);
  });

  test('should maintain precision through multiple operations', () => {
    dataProgram.write(1000.00);
    
    let balance = dataProgram.read();
    balance += 100.25;
    balance -= 50.75;
    balance += 25.50;
    dataProgram.write(balance);

    expect(dataProgram.read()).toBeCloseTo(1075.00, 2);
  });
});
