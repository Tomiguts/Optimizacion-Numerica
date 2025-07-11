import { evaluate, parse } from 'mathjs';

class GoldenSearchEngine {
  constructor(functionExpression, a, b, tolerance = 1e-5) {
    this.expression = functionExpression;
    this.a = parseFloat(a);
    this.b = parseFloat(b);
    this.tolerance = parseFloat(tolerance);
    
    // Golden ratio constants
    this.phi = (1 + Math.sqrt(5)) / 2; // ≈ 1.618
    this.resphi = 2 - this.phi; // ≈ 0.618
    
    // Parse the function first
    try {
      this.parsedFunction = parse(this.expression);
    } catch (error) {
      throw new Error('Error parseando la función: ' + error.message);
    }
    
    // Validate inputs
    this.validateInputs();
  }

  validateInputs() {
    if (this.a >= this.b) {
      throw new Error('El límite inferior debe ser menor que el superior');
    }
    
    if (this.tolerance <= 0) {
      throw new Error('La tolerancia debe ser mayor que cero');
    }

    // Test function evaluation with multiple points
    try {
      const testPoints = [this.a, (this.a + this.b) / 2, this.b];
      for (let point of testPoints) {
        const result = this.evaluateFunction(point);
        if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
          throw new Error(`La función retorna un valor inválido en x=${point}: ${result}`);
        }
      }
    } catch (error) {
      throw new Error('Error en validación de función: ' + error.message);
    }
  }

  evaluateFunction(x) {
    try {
      const scope = { x: x };
      return this.parsedFunction.evaluate(scope);
    } catch (error) {
      throw new Error(`Error evaluando f(${x}): ${error.message}`);
    }
  }

  async optimize(onIteration = null) {
    let a = this.a;
    let b = this.b;
    let iteration = 0;
    const maxIterations = 1000;

    // Initial points
    let lambda = a + this.resphi * (b - a);
    let mu = a + (1 - this.resphi) * (b - a);
    
    let fLambda = this.evaluateFunction(lambda);
    let fMu = this.evaluateFunction(mu);

    const iterations = [];

    // Initial iteration data
    const initialData = {
      iteration: 0,
      a: a,
      b: b,
      lambda: lambda,
      mu: mu,
      fLambda: fLambda,
      fMu: fMu,
      intervalWidth: b - a,
      bestPoint: fLambda < fMu ? lambda : mu,
      bestValue: Math.min(fLambda, fMu)
    };

    iterations.push(initialData);
    if (onIteration) onIteration(initialData);

    // Main optimization loop
    while (Math.abs(b - a) > this.tolerance && iteration < maxIterations) {
      iteration++;

      if (fLambda < fMu) {
        // Minimum is in [a, mu]
        b = mu;
        mu = lambda;
        fMu = fLambda;
        lambda = a + this.resphi * (b - a);
        fLambda = this.evaluateFunction(lambda);
      } else {
        // Minimum is in [lambda, b]
        a = lambda;
        lambda = mu;
        fLambda = fMu;
        mu = a + (1 - this.resphi) * (b - a);
        fMu = this.evaluateFunction(mu);
      }

      const iterationData = {
        iteration: iteration,
        a: a,
        b: b,
        lambda: lambda,
        mu: mu,
        fLambda: fLambda,
        fMu: fMu,
        intervalWidth: b - a,
        bestPoint: fLambda < fMu ? lambda : mu,
        bestValue: Math.min(fLambda, fMu)
      };

      iterations.push(iterationData);
      if (onIteration) onIteration(iterationData);

      // Small delay for visualization
      if (onIteration) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Final result
    const finalX = (a + b) / 2;
    const finalFx = this.evaluateFunction(finalX);

    const result = {
      x: finalX,
      fx: finalFx,
      iterations: iteration,
      tolerance: this.tolerance,
      intervalWidth: b - a,
      converged: Math.abs(b - a) <= this.tolerance,
      allIterations: iterations
    };

    return result;
  }

  // Generate points for plotting the function
  generatePlotPoints(numPoints = 1000) {
    const points = [];
    const step = (this.b - this.a) / (numPoints - 1);
    
    for (let i = 0; i < numPoints; i++) {
      const x = this.a + i * step;
      try {
        const y = this.evaluateFunction(x);
        points.push({ x, y });
      } catch (error) {
        // Skip invalid points
        continue;
      }
    }
    
    return points;
  }

  // Static method to get golden ratio
  static getGoldenRatio() {
    return (1 + Math.sqrt(5)) / 2;
  }

  // Static method to get reduction factor
  static getReductionFactor() {
    return 2 - GoldenSearchEngine.getGoldenRatio();
  }
}

export default GoldenSearchEngine;