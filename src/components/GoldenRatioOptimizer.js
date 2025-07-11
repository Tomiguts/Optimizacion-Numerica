import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import FunctionInput from './FunctionInput';
import ParameterControls from './ParameterControls';
import VisualizationCanvas from './VisualizationCanvas';
import IterationTable from './IterationTable';
import ResultsPanel from './ResultsPanel';
import GoldenSearchEngine from './GoldenSearchEngine.js';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  min-height: 100vh;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.1);
`;

const Header = styled(motion.header)`
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 20px rgba(255, 107, 53, 0.3);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  font-weight: 400;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
  margin-bottom: 30px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RightPanel = styled.div`
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
`;

const BottomSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-top: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const GoldenRatioOptimizer = () => {
  const [functionExpression, setFunctionExpression] = useState('x^2 - 4*x + 3');
  const [intervalA, setIntervalA] = useState(0);
  const [intervalB, setIntervalB] = useState(5);
  const [tolerance, setTolerance] = useState(0.001);
  const [iterations, setIterations] = useState([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState(null);
  const [currentIteration, setCurrentIteration] = useState(0);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setIterations([]);
    setResult(null);
    setCurrentIteration(0);

    try {
      // Validaciones adicionales antes de crear el engine
      if (!functionExpression.trim()) {
        throw new Error('Debe ingresar una función');
      }
      
      if (intervalA >= intervalB) {
        throw new Error('El límite inferior debe ser menor que el superior');
      }

      const engine = new GoldenSearchEngine(
        functionExpression,
        intervalA,
        intervalB,
        tolerance
      );

      const results = await engine.optimize((iterationData) => {
        setCurrentIteration(prev => prev + 1);
        setIterations(prev => [...prev, iterationData]);
      });

      setResult(results);
    } catch (error) {
      console.error('Error in optimization:', error);
      // Mostrar el error de manera más amigable
      const errorMessage = error.message || 'Error desconocido en la optimización';
      alert('Error: ' + errorMessage);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleReset = () => {
    setIterations([]);
    setResult(null);
    setCurrentIteration(0);
    setIsOptimizing(false);
    // Resetear también los valores por defecto si quieres
    setFunctionExpression('x^2 - 4*x + 3');
    setIntervalA(0);
    setIntervalB(5);
    setTolerance(0.001);
  };

  return (
    <Container>
      <Header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Title>Golden Ratio Search Optimizer</Title>
        <Subtitle>
          Encuentra el mínimo de una función usando el método de búsqueda de la razón áurea
        </Subtitle>
      </Header>

      <MainContent>
        <LeftPanel>
          <FunctionInput
            functionExpression={functionExpression}
            setFunctionExpression={setFunctionExpression}
          />
          
          <ParameterControls
            intervalA={intervalA}
            setIntervalA={setIntervalA}
            intervalB={intervalB}
            setIntervalB={setIntervalB}
            tolerance={tolerance}
            setTolerance={setTolerance}
            onOptimize={handleOptimize}
            onReset={handleReset}
            isOptimizing={isOptimizing}
          />
        </LeftPanel>

        <RightPanel>
          <VisualizationCanvas
            functionExpression={functionExpression}
            intervalA={intervalA}
            intervalB={intervalB}
            iterations={iterations}
            currentIteration={currentIteration}
          />
        </RightPanel>
      </MainContent>

      <BottomSection>
        <IterationTable 
          iterations={iterations}
          isOptimizing={isOptimizing}
        />
        
        <ResultsPanel 
          result={result}
          iterations={iterations}
          functionExpression={functionExpression}
        />
      </BottomSection>
    </Container>
  );
};

export default GoldenRatioOptimizer;