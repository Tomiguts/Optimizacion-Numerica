    import React, { useMemo, useEffect, useState } from 'react';
    import styled from 'styled-components';
    import { motion } from 'framer-motion';
    import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Scatter, ScatterChart } from 'recharts';
    import { parse } from 'mathjs';

    const Container = styled(motion.div)`
    height: 100%;
    min-height: 500px;
    `;

    const Title = styled.h3`
    color: #343a40;
    margin-bottom: 20px;
    font-size: 1.3rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
    `;

    const ChartIcon = styled.span`
    background: linear-gradient(135deg, #ff6b35, #f7931e);
    color: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.9rem;
    `;

    const ChartContainer = styled.div`
    width: 100%;
    height: 400px;
    background: #ffffff;
    border-radius: 8px;
    padding: 10px;
    position: relative;
    `;

    const Legend = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-top: 15px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
    `;

    const LegendItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    color: #495057;
    `;

    const LegendColor = styled.div`
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${props => props.color};
    `;

    const LegendLine = styled.div`
    width: 20px;
    height: 3px;
    background: ${props => props.color};
    border-radius: 2px;
    `;

    const CurrentIterationInfo = styled.div`
    position: absolute;
    top: 15px;
    right: 15px;
    background: rgba(255, 107, 53, 0.9);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 600;
    z-index: 10;
    `;

    const ErrorMessage = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #dc3545;
    font-size: 1.1rem;
    text-align: center;
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    `;

    const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
            <p style={{ margin: 0, fontWeight: 'bold' }}>
            x = {parseFloat(label).toFixed(4)}
            </p>
            {payload.map((entry, index) => (
            <p key={index} style={{ margin: '2px 0', color: entry.color }}>
                {entry.name}: {parseFloat(entry.value).toFixed(4)}
            </p>
            ))}
        </div>
        );
    }
    return null;
    };

    const VisualizationCanvas = ({ 
    functionExpression, 
    intervalA, 
    intervalB, 
    iterations, 
    currentIteration 
    }) => {
    const [functionData, setFunctionData] = useState([]);
    const [error, setError] = useState('');

    // Generate function plot data
    const generateFunctionData = useMemo(() => {
        if (!functionExpression) return [];

        try {
        const parsedFunction = parse(functionExpression);
        const points = [];
        const numPoints = 500;
        const range = intervalB - intervalA;
        const step = range / (numPoints - 1);
        
        for (let i = 0; i < numPoints; i++) {
            const x = intervalA + i * step;
            try {
            const scope = { x: x };
            const y = parsedFunction.evaluate(scope);
            
            if (typeof y === 'number' && isFinite(y)) {
                points.push({ x: x, y: y });
            }
            } catch (evalError) {
            // Skip points that can't be evaluated
            continue;
            }
        }
        
        setError('');
        return points;
        } catch (err) {
        setError(`Error graficando función: ${err.message}`);
        return [];
        }
    }, [functionExpression, intervalA, intervalB]);

    useEffect(() => {
        setFunctionData(generateFunctionData);
    }, [generateFunctionData]);

    // Get current iteration data for visualization
    const currentIterationData = useMemo(() => {
        if (iterations.length === 0) return null;
        
        const current = iterations[Math.min(currentIteration, iterations.length - 1)];
        if (!current) return null;

        return {
        lambda: { x: current.lambda, y: current.fLambda },
        mu: { x: current.mu, y: current.fMu },
        interval: { a: current.a, b: current.b },
        best: { x: current.bestPoint, y: current.bestValue }
        };
    }, [iterations, currentIteration]);

    // Create scatter points for current iteration
    const scatterData = useMemo(() => {
        if (!currentIterationData) return [];
        
        return [
        { x: currentIterationData.lambda.x, y: currentIterationData.lambda.y, type: 'lambda' },
        { x: currentIterationData.mu.x, y: currentIterationData.mu.y, type: 'mu' },
        { x: currentIterationData.best.x, y: currentIterationData.best.y, type: 'best' }
        ];
    }, [currentIterationData]);

    if (error) {
        return (
        <Container>
            <Title>
            <ChartIcon>📊</ChartIcon>
            Visualización de la Función
            </Title>
            <ErrorMessage>{error}</ErrorMessage>
        </Container>
        );
    }

    return (
        <Container
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        >
        <Title>
            <ChartIcon>📊</ChartIcon>
            Visualización de la Función
        </Title>

        <ChartContainer>
            {currentIteration > 0 && (
            <CurrentIterationInfo>
                Iteración: {currentIteration}
            </CurrentIterationInfo>
            )}

            <ResponsiveContainer width="100%" height="100%">
            <LineChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                <XAxis 
                type="number"
                dataKey="x"
                domain={[intervalA, intervalB]}
                tickFormatter={(value) => value.toFixed(2)}
                stroke="#6c757d"
                />
                <YAxis 
                type="number"
                tickFormatter={(value) => value.toFixed(2)}
                stroke="#6c757d"
                />
                <Tooltip content={<CustomTooltip />} />
                
                {/* Function curve */}
                <Line
                data={functionData}
                type="monotone"
                dataKey="y"
                stroke="#ff6b35"
                strokeWidth={2}
                dot={false}
                name="f(x)"
                />

                {/* Current interval boundaries */}
                {currentIterationData && (
                <>
                    <ReferenceLine 
                    x={currentIterationData.interval.a} 
                    stroke="#28a745" 
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    />
                    <ReferenceLine 
                    x={currentIterationData.interval.b} 
                    stroke="#28a745" 
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    />
                </>
                )}

                {/* Lambda point */}
                {currentIterationData && (
                <ReferenceLine 
                    x={currentIterationData.lambda.x} 
                    stroke="#007bff" 
                    strokeDasharray="3 3"
                />
                )}

                {/* Mu point */}
                {currentIterationData && (
                <ReferenceLine 
                    x={currentIterationData.mu.x} 
                    stroke="#6610f2" 
                    strokeDasharray="3 3"
                />
                )}

                {/* Best point */}
                {currentIterationData && (
                <ReferenceLine 
                    x={currentIterationData.best.x} 
                    stroke="#dc3545" 
                    strokeDasharray="2 2"
                    strokeWidth={3}
                />
                )}
            </LineChart>
            </ResponsiveContainer>

            {/* Overlay scatter plot for points */}
            {scatterData.length > 0 && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <XAxis 
                    type="number"
                    dataKey="x"
                    domain={[intervalA, intervalB]}
                    hide
                    />
                    <YAxis type="number" hide />
                    
                    <Scatter
                    data={scatterData.filter(d => d.type === 'lambda')}
                    fill="#007bff"
                    r={6}
                    />
                    <Scatter
                    data={scatterData.filter(d => d.type === 'mu')}
                    fill="#6610f2"
                    r={6}
                    />
                    <Scatter
                    data={scatterData.filter(d => d.type === 'best')}
                    fill="#dc3545"
                    r={8}
                    />
                </ScatterChart>
                </ResponsiveContainer>
            </div>
            )}
        </ChartContainer>

        <Legend>
            <LegendItem>
            <LegendLine color="#ff6b35" />
            <span>f(x) - Función objetivo</span>
            </LegendItem>
            <LegendItem>
            <LegendLine color="#28a745" />
            <span>Intervalo actual [a, b]</span>
            </LegendItem>
            <LegendItem>
            <LegendColor color="#007bff" />
            <span>λ (Lambda) - Punto de evaluación</span>
            </LegendItem>
            <LegendItem>
            <LegendColor color="#6610f2" />
            <span>μ (Mu) - Punto de evaluación</span>
            </LegendItem>
            <LegendItem>
            <LegendColor color="#dc3545" />
            <span>Mejor punto actual</span>
            </LegendItem>
        </Legend>
        </Container>
    );
    };

    export default VisualizationCanvas;