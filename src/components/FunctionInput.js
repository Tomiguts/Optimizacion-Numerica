    import React, { useState } from 'react';
    import styled from 'styled-components';
    import { motion } from 'framer-motion';
    import { parse } from 'mathjs';

    const Container = styled(motion.div)`
    background: #ffffff;
    border: 1px solid #e9ecef;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    `;

    const Title = styled.h3`
    color: #343a40;
    margin-bottom: 15px;
    font-size: 1.3rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
    `;

    const FunctionIcon = styled.span`
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

    const InputGroup = styled.div`
    margin-bottom: 20px;
    `;

    const Label = styled.label`
    display: block;
    margin-bottom: 8px;
    color: #495057;
    font-weight: 500;
    font-size: 0.95rem;
    `;

    const FunctionInputField = styled.input`
    width: 100%;
    padding: 12px 16px;
    border: 2px solid ${props => props.hasError ? '#dc3545' : '#dee2e6'};
    border-radius: 8px;
    font-size: 1rem;
    font-family: 'Courier New', monospace;
    background-color: ${props => props.hasError ? '#fff5f5' : '#ffffff'};
    transition: all 0.3s ease;

    &:focus {
        outline: none;
        border-color: #ff6b35;
        box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
    }

    &::placeholder {
        color: #6c757d;
        font-style: italic;
    }
    `;

    const ErrorMessage = styled.div`
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 5px;
    padding: 8px 12px;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 6px;
    `;

    const ExampleFunctions = styled.div`
    margin-top: 15px;
    `;

    const ExampleTitle = styled.h4`
    color: #6c757d;
    font-size: 0.9rem;
    margin-bottom: 10px;
    font-weight: 500;
    `;

    const ExampleList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    `;

    const ExampleButton = styled.button`
    padding: 6px 12px;
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 20px;
    font-size: 0.8rem;
    font-family: 'Courier New', monospace;
    color: #495057;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: #ff6b35;
        color: white;
        border-color: #ff6b35;
        transform: translateY(-1px);
    }
    `;

    const ValidationIcon = styled.div`
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${props => props.isValid ? '#28a745' : '#dc3545'};
    font-size: 1.2rem;
    `;

    const InputWrapper = styled.div`
    position: relative;
    `;

    const FunctionInput = ({ functionExpression, setFunctionExpression }) => {
    const [error, setError] = useState('');
    const [isValid, setIsValid] = useState(true);

    const examples = [
        'x^2 - 4*x + 3',
        'sin(x) + cos(x)',
        'exp(-x^2)',
        'abs(x - 2) + (x - 1)^2',
        'x^3 - 6*x^2 + 9*x + 1',
        'log(x + 1)',
        '(x - 2)^4 + (x - 1)^2'
    ];

    const validateFunction = (expression) => {
        if (!expression.trim()) {
        setError('La función no puede estar vacía');
        setIsValid(false);
        return false;
        }

        try {
        // Parse the function
        const parsed = parse(expression);
        
        // Test evaluation with a sample value
        const scope = { x: 1 };
        const result = parsed.evaluate(scope);
        
        // Check if result is a number
        if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
            throw new Error('La función debe retornar un número válido');
        }
        
        setError('');
        setIsValid(true);
        return true;
        } catch (err) {
        setError(`Función inválida: ${err.message}`);
        setIsValid(false);
        return false;
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setFunctionExpression(value);
        
        // Validate with a small delay to avoid excessive validations
        clearTimeout(window.functionValidationTimeout);
        window.functionValidationTimeout = setTimeout(() => {
        validateFunction(value);
        }, 300);
    };

    const handleExampleClick = (example) => {
        setFunctionExpression(example);
        validateFunction(example);
    };

    return (
        <Container
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        >
        <Title>
            <FunctionIcon>f</FunctionIcon>
            Función a Optimizar
        </Title>
        
        <InputGroup>
            <Label htmlFor="function-input">
            f(x) = 
            </Label>
            <InputWrapper>
            <FunctionInputField
                id="function-input"
                type="text"
                value={functionExpression}
                onChange={handleInputChange}
                placeholder="Ej: x^2 - 4*x + 3"
                hasError={!isValid}
            />
            {functionExpression && (
                <ValidationIcon isValid={isValid}>
                {isValid ? '✓' : '✗'}
                </ValidationIcon>
            )}
            </InputWrapper>
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </InputGroup>

        <ExampleFunctions>
            <ExampleTitle>Funciones de ejemplo:</ExampleTitle>
            <ExampleList>
            {examples.map((example, index) => (
                <ExampleButton
                key={index}
                onClick={() => handleExampleClick(example)}
                >
                {example}
                </ExampleButton>
            ))}
            </ExampleList>
        </ExampleFunctions>
        </Container>
    );
    };

    export default FunctionInput;