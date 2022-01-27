import React from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { fetchCoinHistory } from '../api';
import { isDarkAtom } from '../atoms';

const Table = styled.table`
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 50px;
    border-radius: 20px;
    border-style: hidden;
    @media screen and (max-width: 480px) {
        table {
            font-size: 8px;
        }
    }
`;

const TH = styled.th`
    border: 1px solid;
    text-align: left;
    padding: 8px;
    background-color: rgba(0, 0, 0, 0.5);
`;

const TR = styled.tr`
    height: 45px;
    &:nth-child(even) {
        background-color: rgb(76, 85, 97);
    }
    &:hover {
        background-color: #192a56;
    }
`;

const TD = styled.td`
    border: 1px solid;
    text-align: left;
    padding: 8px;
    vertical-align: middle;   // 테이블 수직 중앙 정렬
`;

// 하루 분량의 가격 변동 데이터
interface IHistorical {
    time_open: string;
    time_close: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    market_cap: number;
}

interface ChartProps {
    coinId: string;
}

function Price({coinId}: ChartProps) {
    // 2주일치 데이터를 가져오므로 data의 타입으로 배열을 지정해줘야 함
    const {isLoading, data} = useQuery<IHistorical[]>(
        ["ohlcv", coinId], 
        () => fetchCoinHistory(coinId!),
        {
            refetchInterval: 10000,
        }
    )

    return (
        <div>{isLoading ? (
            "Loading chart..."
        ) : (
            <Table>
                <tr>
                    <TH>Date</TH>
                    <TH>Open</TH>
                    <TH>High</TH>
                    <TH>Low</TH>
                    <TH>Close</TH>
                </tr>
                {
                    data?.map((pr) => (
                        <TR>
                            <TD>{(pr.time_close).substring(5, 10)}</TD>
                            <TD>{(pr.high).toFixed(3)}</TD>
                            <TD>{(pr.high).toFixed(3)}</TD>
                            <TD>{(pr.low).toFixed(3)}</TD>
                            <TD>{(pr.close).toFixed(3)}</TD>
                        </TR>
                    ))
                }
            </Table>
        )}
        </div>
    );
}

export default Price;