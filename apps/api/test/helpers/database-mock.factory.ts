import { vi } from 'vitest';
import { mock, MockProxy } from 'vitest-mock-extended';

/**
 * Creates a mock database connection for Drizzle ORM
 * This mock includes common chainable query methods
 */
export function createMockDatabase<T = any>() {
  const mockDb = mock<any>();

  // Mock select chain
  const createSelectChain = (returnValue: T[] = []) => {
    const selectChain = {
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue(returnValue),
        }),
        limit: vi.fn().mockResolvedValue(returnValue),
      }),
    };
    return selectChain;
  };

  // Mock insert chain
  const createInsertChain = (returnValue: T[] = []) => {
    return {
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue(returnValue),
      }),
    };
  };

  // Mock update chain
  const createUpdateChain = (returnValue: T[] = []) => {
    return {
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue(returnValue),
        }),
      }),
    };
  };

  // Mock delete chain
  const createDeleteChain = () => {
    return {
      where: vi.fn().mockResolvedValue(undefined),
    };
  };

  mockDb.select = vi.fn(() => createSelectChain());
  mockDb.insert = vi.fn(() => createInsertChain());
  mockDb.update = vi.fn(() => createUpdateChain());
  mockDb.delete = vi.fn(() => createDeleteChain());

  return mockDb as MockProxy<any>;
}
