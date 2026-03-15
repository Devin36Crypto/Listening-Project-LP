import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getStorageUsage } from './db';

describe('db service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should estimate storage usage using navigator.storage if available', async () => {
    // Mock navigator.storage
    const mockEstimate = vi.fn().mockResolvedValue({ usage: 1024 });
    vi.stubGlobal('navigator', {
      storage: {
        estimate: mockEstimate
      }
    });

    const usage = await getStorageUsage();
    expect(usage).toBe(1024);
    expect(mockEstimate).toHaveBeenCalled();
  });

  it('should fallback to rough estimate if navigator.storage fails', async () => {
    vi.stubGlobal('navigator', { storage: undefined });
    const usage = await getStorageUsage();
    expect(usage).toBeGreaterThanOrEqual(0);
  });

  it('should handle error in navigator.storage.estimate gracefully', async () => {
    vi.stubGlobal('navigator', {
      storage: {
        estimate: vi.fn().mockRejectedValue(new Error('Estimation failed'))
      }
    });

    const usage = await getStorageUsage();
    expect(usage).toBeGreaterThanOrEqual(0); // Should still return the fallback estimate
  });
});
