/**
 * Circuit breaker for API calls
 * Prevents cascading failures by detecting service problems and failing fast
 */
export class CircuitBreaker {
  constructor() {
    this.states = {};
    this.failureThreshold = 3;
    this.resetTimeout = 10000;
  }

  async call(serviceId, apiCall) {
    if (!this.states[serviceId]) {
      this.states[serviceId] = {
        state: "CLOSED",
        failures: 0,
        lastFailureTime: null,
      };
    }

    const serviceState = this.states[serviceId];

    if (serviceState.state === "OPEN") {
      if (Date.now() - serviceState.lastFailureTime >= this.resetTimeout) {
        serviceState.state = "HALF-OPEN";
      } else {
        throw new Error(
          `Service ${serviceId} is unavailable - circuit breaker is open`
        );
      }
    }

    try {
      const result = await apiCall();
      if (serviceState.state === "HALF-OPEN") {
        serviceState.state = "CLOSED";
        serviceState.failures = 0;
      }
      return result;
    } catch (error) {
      serviceState.failures++;
      serviceState.lastFailureTime = Date.now();

      if (
        serviceState.failures >= this.failureThreshold ||
        serviceState.state === "HALF-OPEN"
      ) {
        serviceState.state = "OPEN";
      }
      throw error;
    }
  }
}
