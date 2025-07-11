    import React from 'react';
    import styled from 'styled-components';
    import { motion } from 'framer-motion';

    const Container = styled(motion.div)`
    background: #ffffff;
    border: 1px solid #e9ecef;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    height: fit-content;
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

    const ResultIcon = styled.span`
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

    const ResultCard = styled(motion.div)`
    background: linear-gradient(135deg, #28a745, #20c997);
    color: white;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 20px;
    text-align: center;
    box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
    `;

    const MainResult = styled.div`
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 8px;
    font-family: 'Courier New', monospace;
    `;

    const SecondaryResult = styled.div`
    font-size: 1.2rem;
    font-weight: 500;
    opacity: 0.9;
    font-family: 'Courier New', monospace;
    `;

    const ResultLabel = styled.div`
    font-size: 0.9rem;
    opacity: 0.8;
    margin-bottom: 5px;
    `;

    const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 20px;
    `;

    const StatCard = styled.div`
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    border-left: 4px solid #ff6b35;
    `;

    const StatValue = styled.div`
    font-size: 1.3rem;
    font-weight: 700;
    color: #ff6b35;
    margin-bottom: 5px;
    font-family: 'Courier New', monospace;
    `;

    const StatLabel = styled.div`
    font-size: 0.85rem;
    color: #6c757d;
    font-weight: 500;
    `;

    const ConvergenceInfo = styled.div`
    background: ${props => props.converged ? '#d4edda' : '#fff3cd'};
    border: 1px solid ${props => props.converged ? '#c3e6cb' : '#ffeaa7'};
    color: ${props => props.converged ? '#155724' : '#856404'};
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    `;

    const ConvergenceIcon = styled.span`
    font-size: 1.2rem;
    `;

    const FunctionInfo = styled.div`
    background: #e9ecef;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 15px;
    `;

    const FunctionLabel = styled.div`
    font-size: 0.9rem;
    color: #6c757d;
    margin-bottom: 5px;
    font-weight: 500;
    `;

    const FunctionExpression = styled.div`
    font-size: 1.1rem;
    font-family: 'Courier New', monospace;
    color: #495057;
    font-weight: 600;
    `;

    const EmptyState = styled.div`
    text-align: center;
    padding: 40px 20px;
    color: #6c757d;
    font-style: italic;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    `;

    const EmptyIcon = styled.div`
    font-size: 3rem;
    opacity: 0.3;
    `;

    const MethodInfo = styled.div`
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    padding: 15px;
    border-radius: 8px;
    margin-top: 15px;
    `;

    const MethodTitle = styled.h4`
    color: #856404;
    margin-bottom: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    `;

    const MethodText = styled.p`
    color: #856404;
    font-size: 0.85rem;
    line-height: 1.4;
    margin: 0;
    `;

    const GoldenRatioDisplay = styled.div`
    background: linear-gradient(135deg, #ff6b35, #f7931e);
    color: white;
    padding: 12px;
    border-radius: 8px;
    text-align: center;
    margin-bottom: 15px;
    `;

    const GoldenRatioValue = styled.div`
    font-size: 1.1rem;
    font-weight: 700;
    font-family: 'Courier New', monospace;
    `;

    const GoldenRatioLabel = styled.div`
    font-size: 0.8rem;
    opacity: 0.9;
    margin-top: 2px;
    `;

    const EfficiencyInfo = styled.div`
    background: #f8f9fa;
    padding: 12px;
    border-radius: 8px;
    margin-top: 15px;
    border-left: 4px solid #28a745;
    `;

    const EfficiencyValue = styled.div`
    font-size: 1rem;
    font-weight: 600;
    color: #28a745;
    margin-bottom: 5px;
    `;

    const EfficiencyLabel = styled.div`
    font-size: 0.8rem;
    color: #6c757d;
    `;

    const ResultsPanel = ({ result, iterations, functionExpression }) => {
    const formatNumber = (num, decimals = 6) => {
        if (typeof num !== 'number') return 'N/A';
        return num.toFixed(decimals);
    };

    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const reductionFactor = 2 - goldenRatio; // ≈ 0.618

    // Calculate efficiency metrics
    const calculateEfficiency = () => {
        if (!result || !iterations.length) return null;
        
        const initialWidth = iterations[0]?.intervalWidth || 0;
        const finalWidth = result.intervalWidth;
        const reduction = initialWidth > 0 ? (finalWidth / initialWidth) : 0;
        const theoreticalReduction = Math.pow(reductionFactor, result.iterations);
        
        return {
        actualReduction: reduction,
        theoreticalReduction: theoreticalReduction,
        efficiency: theoreticalReduction > 0 ? (reduction / theoreticalReduction) : 0
        };
    };

    const efficiency = calculateEfficiency();

    if (!result) {
        return (
        <Container
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
        >
            <Title>
            <ResultIcon>🎯</ResultIcon>
            Resultados de la Optimización
            </Title>

            <EmptyState>
            <EmptyIcon>📊</EmptyIcon>
            <div>
                Los resultados aparecerán aquí después de ejecutar la optimización
            </div>
            </EmptyState>

            <GoldenRatioDisplay>
            <GoldenRatioValue>φ = {goldenRatio.toFixed(8)}</GoldenRatioValue>
            <GoldenRatioLabel>Razón Áurea (Golden Ratio)</GoldenRatioLabel>
            </GoldenRatioDisplay>

            <MethodInfo>
            <MethodTitle>Sobre el Método de Búsqueda de la Razón Áurea</MethodTitle>
            <MethodText>
                Este algoritmo utiliza la razón áurea (φ ≈ 1.618) para encontrar 
                eficientemente el mínimo de una función unimodal. En cada iteración, 
                el intervalo de búsqueda se reduce por un factor de aproximadamente 0.618, 
                garantizando una convergencia rápida y robusta.
            </MethodText>
            </MethodInfo>
        </Container>
        );
    }

    return (
        <Container
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        >
        <Title>
            <ResultIcon>🎯</ResultIcon>
            Resultados de la Optimización
        </Title>

        <FunctionInfo>
            <FunctionLabel>Función optimizada:</FunctionLabel>
            <FunctionExpression>f(x) = {functionExpression}</FunctionExpression>
        </FunctionInfo>

        <ResultCard
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
        >
            <ResultLabel>Mínimo encontrado en:</ResultLabel>
            <MainResult>x* = {formatNumber(result.x)}</MainResult>
            <ResultLabel>Valor de la función:</ResultLabel>
            <SecondaryResult>f(x*) = {formatNumber(result.fx)}</SecondaryResult>
        </ResultCard>

        <ConvergenceInfo converged={result.converged}>
            <ConvergenceIcon>
            {result.converged ? '✅' : '⚠️'}
            </ConvergenceIcon>
            <div>
            {result.converged 
                ? `¡Convergencia exitosa! El algoritmo encontró el mínimo con la tolerancia especificada.`
                : `El algoritmo se detuvo sin alcanzar la tolerancia completa. Considera reducir la tolerancia o aumentar las iteraciones máximas.`
            }
            </div>
        </ConvergenceInfo>

        <StatsGrid>
            <StatCard>
            <StatValue>{result.iterations}</StatValue>
            <StatLabel>Iteraciones</StatLabel>
            </StatCard>
            
            <StatCard>
            <StatValue>{formatNumber(result.tolerance, 6)}</StatValue>
            <StatLabel>Tolerancia</StatLabel>
            </StatCard>
            
            <StatCard>
            <StatValue>{formatNumber(result.intervalWidth, 8)}</StatValue>
            <StatLabel>Ancho final del intervalo</StatLabel>
            </StatCard>
            
            <StatCard>
            <StatValue>{formatNumber(reductionFactor, 4)}</StatValue>
            <StatLabel>Factor de reducción (φ-1)</StatLabel>
            </StatCard>
        </StatsGrid>

        {efficiency && (
            <EfficiencyInfo>
            <EfficiencyValue>
                Reducción del intervalo: {(efficiency.actualReduction * 100).toFixed(4)}%
            </EfficiencyValue>
            <EfficiencyLabel>
                El intervalo se redujo desde {formatNumber(iterations[0]?.intervalWidth, 4)} 
                hasta {formatNumber(result.intervalWidth, 6)}
            </EfficiencyLabel>
            </EfficiencyInfo>
        )}

        <GoldenRatioDisplay>
            <GoldenRatioValue>φ = {goldenRatio.toFixed(8)}</GoldenRatioValue>
            <GoldenRatioLabel>Razón Áurea utilizada en el algoritmo</GoldenRatioLabel>
        </GoldenRatioDisplay>

        <MethodInfo>
            <MethodTitle>Interpretación de Resultados</MethodTitle>
            <MethodText>
            El punto x* = {formatNumber(result.x)} representa el mínimo local de la función 
            en el intervalo especificado. El valor f(x*) = {formatNumber(result.fx)} es el 
            valor mínimo encontrado. El algoritmo realizó {result.iterations} evaluaciones 
            de función para alcanzar esta precisión.
            </MethodText>
        </MethodInfo>
        </Container>
    );
    };

    export default ResultsPanel;