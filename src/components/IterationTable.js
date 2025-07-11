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

    const TableIcon = styled.span`
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

    const TableContainer = styled.div`
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    
    &::-webkit-scrollbar {
        width: 8px;
    }
    
    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: #ff6b35;
        border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
        background: #e55a2b;
    }
    `;

    const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
    `;

    const TableHeader = styled.thead`
    background: linear-gradient(135deg, #ff6b35, #f7931e);
    color: white;
    position: sticky;
    top: 0;
    z-index: 10;
    `;

    const TableHeaderCell = styled.th`
    padding: 12px 8px;
    text-align: center;
    font-weight: 600;
    font-size: 0.8rem;
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    
    &:last-child {
        border-right: none;
    }
    `;

    const TableBody = styled.tbody``;

    const TableRow = styled(motion.tr)`
    border-bottom: 1px solid #dee2e6;
    transition: background-color 0.2s ease;
    
    &:hover {
        background-color: #f8f9fa;
    }
    
    &:last-child {
        border-bottom: none;
    }
    `;

    const TableCell = styled.td`
    padding: 10px 8px;
    text-align: center;
    border-right: 1px solid #dee2e6;
    font-family: 'Courier New', monospace;
    font-size: 0.8rem;
    
    &:last-child {
        border-right: none;
    }
    
    &.number {
        color: ${props => props.isHighlight ? '#dc3545' : '#495057'};
        font-weight: ${props => props.isHighlight ? '600' : '400'};
    }
    `;

    const EmptyState = styled.div`
    text-align: center;
    padding: 40px 20px;
    color: #6c757d;
    font-style: italic;
    `;

    const LoadingState = styled.div`
    text-align: center;
    padding: 40px 20px;
    color: #ff6b35;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    `;

    const LoadingSpinner = styled.div`
    width: 20px;
    height: 20px;
    border: 2px solid #ff6b35;
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    `;

    const SummaryInfo = styled.div`
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 15px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
    `;

    const SummaryItem = styled.div`
    text-align: center;
    `;

    const SummaryValue = styled.div`
    font-size: 1.2rem;
    font-weight: 700;
    color: #ff6b35;
    `;

    const SummaryLabel = styled.div`
    font-size: 0.8rem;
    color: #6c757d;
    margin-top: 2px;
    `;

    const IterationTable = ({ iterations, isOptimizing }) => {
    const formatNumber = (num) => {
        if (typeof num !== 'number') return 'N/A';
        return num.toFixed(6);
    };

    const getLatestIteration = () => {
        return iterations.length > 0 ? iterations[iterations.length - 1] : null;
    };

    const latest = getLatestIteration();

    return (
        <Container
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        >
        <Title>
            <TableIcon>📋</TableIcon>
            Iteraciones del Algoritmo
        </Title>

        {iterations.length > 0 && (
            <SummaryInfo>
            <SummaryItem>
                <SummaryValue>{iterations.length}</SummaryValue>
                <SummaryLabel>Iteraciones</SummaryLabel>
            </SummaryItem>
            {latest && (
                <>
                <SummaryItem>
                    <SummaryValue>{formatNumber(latest.intervalWidth)}</SummaryValue>
                    <SummaryLabel>Ancho actual</SummaryLabel>
                </SummaryItem>
                <SummaryItem>
                    <SummaryValue>{formatNumber(latest.bestValue)}</SummaryValue>
                    <SummaryLabel>Mejor valor</SummaryLabel>
                </SummaryItem>
                </>
            )}
            </SummaryInfo>
        )}

        <TableContainer>
            {isOptimizing && iterations.length === 0 ? (
            <LoadingState>
                <LoadingSpinner />
                Ejecutando algoritmo...
            </LoadingState>
            ) : iterations.length === 0 ? (
            <EmptyState>
                Haz clic en "Optimizar" para ver las iteraciones del algoritmo
            </EmptyState>
            ) : (
            <Table>
                <TableHeader>
                <tr>
                    <TableHeaderCell>Iter</TableHeaderCell>
                    <TableHeaderCell>a</TableHeaderCell>
                    <TableHeaderCell>b</TableHeaderCell>
                    <TableHeaderCell>λ</TableHeaderCell>
                    <TableHeaderCell>μ</TableHeaderCell>
                    <TableHeaderCell>f(λ)</TableHeaderCell>
                    <TableHeaderCell>f(μ)</TableHeaderCell>
                    <TableHeaderCell>Ancho</TableHeaderCell>
                    <TableHeaderCell>Mejor x</TableHeaderCell>
                    <TableHeaderCell>Mejor f(x)</TableHeaderCell>
                </tr>
                </TableHeader>
                <TableBody>
                {iterations.map((iteration, index) => (
                    <TableRow
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    >
                    <TableCell>{iteration.iteration}</TableCell>
                    <TableCell className="number">{formatNumber(iteration.a)}</TableCell>
                    <TableCell className="number">{formatNumber(iteration.b)}</TableCell>
                    <TableCell className="number">{formatNumber(iteration.lambda)}</TableCell>
                    <TableCell className="number">{formatNumber(iteration.mu)}</TableCell>
                    <TableCell className="number">{formatNumber(iteration.fLambda)}</TableCell>
                    <TableCell className="number">{formatNumber(iteration.fMu)}</TableCell>
                    <TableCell className="number">{formatNumber(iteration.intervalWidth)}</TableCell>
                    <TableCell className="number" isHighlight>
                        {formatNumber(iteration.bestPoint)}
                    </TableCell>
                    <TableCell className="number" isHighlight>
                        {formatNumber(iteration.bestValue)}
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            )}
        </TableContainer>
        </Container>
    );
    };

    export default IterationTable;