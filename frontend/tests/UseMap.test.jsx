import { renderHook, act } from '@testing-library/react-hooks';
import { useMap } from 'react-map-gl';
import { UseMap } from '../src/HomePage/UseMap';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('react-map-gl', () => ({
  useMap: vi.fn(),
}));

describe('UseMap custom hook', () => {
  let mapMock;

  beforeEach(() => {
    mapMock = {
      getBounds: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
    };
    useMap.mockReturnValue({ current: mapMock });
  });

  it('should initialize without bounds and not moving', () => {
    const { result } = renderHook(() => UseMap());
    expect(result.current.bounds).toBeUndefined();
    expect(result.current.isMoving).toBe(false);
  });

  it('should handle map movements and update bounds correctly', () => {
    // Setup map to return specific bounds
    const mockBounds = { north: 42, south: 40, east: -73, west: -75 };
    mapMock.getBounds.mockReturnValue(mockBounds);

    const { result } = renderHook(() => UseMap());

    // Simulate map moving
    act(() => {
      const startMoving = mapMock.on.mock.calls.find(call => call[0] === 'movestart')[1];
      startMoving();
    });

    // Check if moving state is true
    expect(result.current.isMoving).toBe(true);

    // Simulate move end
    act(() => {
      const moveEnd = mapMock.on.mock.calls.find(call => call[0] === 'moveend')[1];
      moveEnd();
    });

    // Check if bounds are updated and moving state is false
    expect(result.current.bounds).toEqual(mockBounds);
    expect(result.current.isMoving).toBe(false);
  });

  it('should clean up event listeners on unmount', () => {
    const { unmount } = renderHook(() => UseMap());

    unmount();

    // Verify that map event listeners were removed
    expect(mapMock.off).toHaveBeenCalledWith('movestart', expect.any(Function));
    expect(mapMock.off).toHaveBeenCalledWith('moveend', expect.any(Function));
  });
});
