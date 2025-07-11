    import React from 'react';
    import styled from 'styled-components';
    import { motion } from 'framer-motion';

    const Container = styled(motion.div)`
    background: #ffffff;
    border: 1px solid #e9ecef;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
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

    const SettingsIcon = styled.span`
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

    const ParameterGroup = styled.div`
    margin-bottom: 20px;
    `;

    const Label = styled.label`
    display: block;
    margin-bottom: 8px;
    color: #495057;
    font-weight: 500;
    font-size: 0.95rem;
    `;

    const InputRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 15px;
    `;

    const NumberInput = styled.input`
    width: 100%;
    padding: 10px 12px;
    border: 2px solid #dee2e6;
    border-radius: 8px;
    font-size: 0.95rem;
    transition: all 0.3s ease;

    &:focus {
        outline: none;
        border-color: #ff6b35;
        box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
    }

    &[type="number"] {
        -moz-appearance: textfield;
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    `;

    const ToleranceInput = styled(NumberInput)`
    grid-column: 1 / -1;
    `;

    const ButtonGroup = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 25px;
    `;

    const Button = styled.button`
    flex: 1;
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    `;

    const OptimizeButton = styled(Button)`
    background: linear-gradient(135deg, #ff6b35, #f7931e);
    color: white;
    box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
    }

    &:active:not(:disabled) {
        transform: translateY(0);
    }
    `;

    const ResetButton = styled(Button)`
    background: #6c757d;
    color: white;

    &:hover:not(:disabled) {
        background: #5a6268;
        transform: translateY(-1px);
    }
    `;

    const LoadingSpinner = styled.div`
    width: 16px;
    height: 16px;
    border: 2px solid #ffffff;
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    `;

    const InfoSection = styled.div`
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    border-left: 4px solid #ff6b35;
    `;

    const InfoTitle = styled.h4`
    color: #495057;
    margin-bottom: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    `;

    const InfoText = styled.p`
    color: #6c757d;
    font-size: 0.85rem;
    line-height: 1.4;
    margin: 0;
    `;

    const GoldenRatioInfo = styled.div`
    background: linear-gradient(135deg, #fff3cd, #ffeaa7);
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 15px;
    text-align: center;
    `;

    const GoldenRatioValue = styled.div`
    font-size: 1.1rem;
    font-weight: 700;
    color: #856404;
    margin-bottom: 4px;
    `;

    const GoldenRatioLabel = styled.div`
    font-size: 0.8rem;
    color: #856404;
    opacity: 0.8;
    `;

    const ParameterControls = ({
    intervalA,
    setIntervalA,
    intervalB,
    setIntervalB,
    tolerance,
    setTolerance,
    onOptimize,
    onReset,
    isOptimizing
    }) => {
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    const handleOptimize = () => {
        // Validate inputs before optimizing
        if (intervalA >= intervalB) {
        alert('El límite inferior debe ser menor que el superior');
        return;
        }
        if (tolerance <= 0) {
        alert('La tolerancia debe ser mayor que cero');
        return;
        }
        onOptimize();
    };

    return (
        <Container
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        >
        <Title>
            <SettingsIcon>⚙</SettingsIcon>
            Parámetros de Optimización
        </Title>

        <GoldenRatioInfo>
            <GoldenRatioValue>φ = {goldenRatio.toFixed(6)}</GoldenRatioValue>
            <GoldenRatioLabel>Razón Áurea</GoldenRatioLabel>
        </GoldenRatioInfo>

        <ParameterGroup>
            <Label>Intervalo de búsqueda [a, b]:</Label>
            <InputRow>
            <NumberInput
                type="number"
                step="0.1"
                value={intervalA}
                onChange={(e) => setIntervalA(parseFloat(e.target.value) || 0)}
                placeholder="Límite inferior (a)"
            />
            <NumberInput
                type="number"
                step="0.1"
                value={intervalB}
                onChange={(e) => setIntervalB(parseFloat(e.target.value) || 0)}
                placeholder="Límite superior (b)"
            />
            </InputRow>
        </ParameterGroup>

        <ParameterGroup>
            <Label>Tolerancia (precisión):</Label>
            <ToleranceInput
            type="number"
            step="0.0001"
            min="0.0001"
            max="1"
            value={tolerance}
            onChange={(e) => setTolerance(parseFloat(e.target.value) || 0.001)}
            placeholder="Ej: 0.001"
            />
        </ParameterGroup>

        <InfoSection>
            <InfoTitle>Información del Algoritmo</InfoTitle>
            <InfoText>
            El método de búsqueda de la razón áurea reduce el intervalo de búsqueda 
            por un factor de ~0.618 en cada iteración, convergiendo eficientemente 
            hacia el mínimo de la función.
            </InfoText>
        </InfoSection>

        <ButtonGroup>
            <OptimizeButton
            onClick={handleOptimize}
            disabled={isOptimizing}
            >
            {isOptimizing ? (
                <>
                <LoadingSpinner />
                Optimizando...
                </>
            ) : (
                <>
                ▶
                Optimizar
                </>
            )}
            </OptimizeButton>
            
            <ResetButton
            onClick={onReset}
            disabled={isOptimizing}
            >
            ↻ Reset
            </ResetButton>
        </ButtonGroup>
        </Container>
    );
    };

export default ParameterControls;