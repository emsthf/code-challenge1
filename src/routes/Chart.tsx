import React from "react";
import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";

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

function Chart({ coinId }: ChartProps) {
  // Recoil의 Atom 값을 가져올 수 있는 펑션
  const isDark = useRecoilValue(isDarkAtom);

  // 2주일치 데이터를 가져오므로 data의 타입으로 배열을 지정해줘야 함
  const { isLoading, data } = useQuery<IHistorical[]>(
    ["ohlcv", coinId],
    () => fetchCoinHistory(coinId!),
    {
      refetchInterval: 10000,
    }
  );
  // console.log(data?.map(price => (price.time_close)));

  const days = data?.map((day) => day.time_close.substring(5, 10));
  const priceO = data?.map((day) => day.open);
  const priceH = data?.map((day) => day.high);
  const priceL = data?.map((day) => day.low);
  const priceC = data?.map((day) => day.close);

  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <ApexChart
          type="candlestick"
          series={[
            {
              data: [
                {
                  x: new Date(days![0]),
                  y: [priceO![0], priceH![0], priceL![0], priceC![0]],
                },
                {
                  x: new Date(days![1]),
                  y: [priceO![1], priceH![1], priceL![1], priceC![1]],
                },
                {
                  x: new Date(days![2]),
                  y: [priceO![2], priceH![2], priceL![2], priceC![2]],
                },
                {
                  x: new Date(days![3]),
                  y: [priceO![3], priceH![3], priceL![3], priceC![3]],
                },
                {
                  x: new Date(days![4]),
                  y: [priceO![4], priceH![4], priceL![4], priceC![4]],
                },
                {
                  x: new Date(days![5]),
                  y: [priceO![5], priceH![5], priceL![5], priceC![5]],
                },
                {
                  x: new Date(days![6]),
                  y: [priceO![6], priceH![6], priceL![6], priceC![6]],
                },
                {
                  x: new Date(days![7]),
                  y: [priceO![7], priceH![7], priceL![7], priceC![7]],
                },
                {
                  x: new Date(days![8]),
                  y: [priceO![8], priceH![8], priceL![8], priceC![8]],
                },
                {
                  x: new Date(days![9]),
                  y: [priceO![9], priceH![9], priceL![9], priceC![9]],
                },
                {
                  x: new Date(days![10]),
                  y: [priceO![10], priceH![10], priceL![10], priceC![10]],
                },
                {
                  x: new Date(days![11]),
                  y: [priceO![11], priceH![11], priceL![11], priceC![11]],
                },
                {
                  x: new Date(days![12]),
                  y: [priceO![12], priceH![12], priceL![12], priceC![12]],
                },
                {
                  x: new Date(days![13]),
                  y: [priceO![13], priceH![13], priceL![13], priceC![13]],
                },
              ],
            },
          ]}
          options={{
            theme: {
              mode: isDark ? "dark" : "light",
            },
            chart: {
              height: 350,
              width: 500,
              toolbar: {
                show: false,
              },
              background: "transparent",
            },
            grid: {
              show: false,
            },
            stroke: {
              curve: "smooth",
              width: 4,
            },
            xaxis: {
              type: "datetime",
              categories: data?.map((day) => day.time_close.substring(5, 10)),
              // 아래 옵션을 전부 true로 바꿔주면 x 축에 날짜가 나타남
              labels: {
                show: true,
              },
              axisTicks: {
                show: false,
              },
              axisBorder: {
                show: false,
              },
            },
            yaxis: {
              show: true,
              tooltip: {
                enabled: true,
              },
              labels: {
                formatter: (value) => `${value.toFixed(3)}`,
              },
            },
            tooltip: {
              y: {
                formatter: (value) => `${value.toFixed(3)}`,
              },
            },
          }}
        />
        // <ApexChart
        //   type="line"
        //   series={[
        //     {
        //       name: "price",
        //       data: data?.map((price) => price.close), // 종가만 map으로 갯수만큼 반복
        //     },
        //   ]}
        //   options={{
        //     theme: {
        //       mode: isDark ? "dark" : "light",
        //     },
        //     chart: {
        //       height: 300,
        //       width: 500,
        //       toolbar: {
        //         show: false,
        //       },
        //       background: "transparent",
        //     },
        //     grid: {
        //       show: false,
        //     },
        //     stroke: {
        //       curve: "smooth",
        //       width: 4,
        //     },
        //     xaxis: {
        //       type: "datetime",
        //       categories: data?.map((day) => day.time_close.substring(5, 10)),
        //       // 아래 옵션을 전부 true로 바꿔주면 x 축에 날짜가 나타남
        //       labels: {
        //         show: true,
        //       },
        //       axisTicks: {
        //         show: false,
        //       },
        //       axisBorder: {
        //         show: false,
        //       },
        //     },
        //     yaxis: {
        //       show: false,
        //     },
        //     fill: {
        //       type: "gradient",
        //       gradient: {
        //         gradientToColors: ["#0be881"],
        //         stops: [0, 100],
        //       },
        //     },
        //     colors: ["#0fbcf9"],
        //     tooltip: {
        //       y: {
        //         formatter: (value) => `$ ${value.toFixed(3)}`,
        //       },
        //     },
        //   }}
        // />
      )}
    </div>
  );
}

export default Chart;
