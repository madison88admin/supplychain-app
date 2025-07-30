import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  renderCount: number;
  averageRenderTime: number;
}

export const usePerformanceMonitor = (componentName: string, enabled: boolean = false) => {
  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);
  const totalRenderTime = useRef<number>(0);

  const startRender = useCallback(() => {
    if (enabled) {
      renderStartTime.current = performance.now();
    }
  }, [enabled]);

  const endRender = useCallback(() => {
    if (enabled && renderStartTime.current > 0) {
      const renderTime = performance.now() - renderStartTime.current;
      renderCount.current += 1;
      totalRenderTime.current += renderTime;

      // Log slow renders (over 16ms = 60fps threshold)
      if (renderTime > 16) {
        console.warn(
          `🚨 Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`
        );
      }

      // Log performance metrics every 10 renders
      if (renderCount.current % 10 === 0) {
        const averageRenderTime = totalRenderTime.current / renderCount.current;
        console.log(
          `📊 ${componentName} Performance:`,
          `Avg: ${averageRenderTime.toFixed(2)}ms`,
          `Total: ${renderCount.current} renders`
        );
      }
    }
  }, [enabled, componentName]);

  useEffect(() => {
    startRender();
    return () => {
      endRender();
    };
  });

  const getMetrics = useCallback((): PerformanceMetrics => {
    return {
      renderTime: renderStartTime.current > 0 ? performance.now() - renderStartTime.current : 0,
      renderCount: renderCount.current,
      averageRenderTime: renderCount.current > 0 ? totalRenderTime.current / renderCount.current : 0
    };
  }, []);

  return { startRender, endRender, getMetrics };
}; 