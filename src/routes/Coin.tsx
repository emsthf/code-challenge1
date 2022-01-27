import React from "react";
import { useQuery } from "react-query";
import { Helmet } from "react-helmet";
import { Link, useMatch } from "react-router-dom";
import { Route, Routes, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import Chart from "./Chart";
import Price from "./Price";

const HomeBtn = styled.div`
  position: absolute;
  border-radius: 12px;
  width: 30px;
  border: 0;
  margin: 7vh 0px;
  font-size: 22px;
`;

const Icon = styled.i`
  color: ${(props) => props.theme.textColor};
  transition: all 300ms ease;
  &:hover {
    transform: rotate(-30deg) scale(1.1);
    color: ${(props) => props.theme.accentColor};
  }
`;

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  z-index: -1;
  height: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between; // 양쪽 벽으로 벌려서 정렬
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
`;
const OverviewItem = styled.div`
  display: flex;
  flex-direction: column; // 태그를 세로로 쌓음
  align-items: center;
  width: 33%;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;
const Description = styled.p`
  margin: 20px 0px;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  color: ${(props) => (props.isActive ? props.theme.accentColor : props.theme.textColor)};
  a {
    display: block;
    padding: 7px 0px;
  }
`;

interface RouteState {
  state: {
    name: string;
  };
}

interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: Date;
  last_updated: Date;
  quotes: {
    USD: {
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_15m: number;
      percent_change_30m: number;
      percent_change_1h: number;
      percent_change_6h: number;
      percent_change_12h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      percent_change_30d: number;
      percent_change_1y: number;
      ath_price: number;
      ath_date: Date;
      percent_from_price_ath: number;
    };
  };
}

function Coin() {
  // react-douter-dom v6부터는 useParams가 자동으로 string or undefined로 지정되어 있어서 인터페이스로 타입을 정해주지 않아도 된다.
  const { coinId } = useParams();
  // react-douter-dom v6부터는 제네릭을 지원하지 않고 as 를 사용해야 한다
  const { state } = useLocation() as RouteState;
  // Virtual DOM에 있는 로케이션에서 Coins에서 받은 state를 꺼낸다.
  // 이 컴포넌트에서 API를 직접 받지 않고도 이름을 받아오게 됨(=이미 부모 컴포넌트에서 가지고 있는 name을 state로 받을 뿐이라 구동이 빨라짐)
  // console.log("state : " + state);

  // useMatch는 react-router-dom의 기능으로 니가 지금 특정한 url에 있는지 여부를 알려줌
  // v5는 useRouteMatch. v6는 useMatch
  const priceMatch = useMatch("/:coinId/price");
  const chartMatch = useMatch("/:coinId/chart");

  // react-router-dom v6부터는 useParams가 자동으로 string || undifined이기 때문에 쿼리 함수의 파라미터에 들어갈 수 없는 형식이다.
  // 그래서 !를 붙여 undefined이 아닌 무조건 값이 할당 되어 있다고 컴파일러에 전달해 값이 없어도 변수를 사용할 수 있게 해야 한다
  const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(
    ["info", coinId],
    () => fetchCoinInfo(coinId!)
  );
  const { isLoading: tickersLoading, data: tickersData } = useQuery<PriceData>(
    ["tickers", coinId],
    () => fetchCoinTickers(coinId!),
    {
      refetchInterval: 5000, // 5초마다 refetchig 해서 새로 값을 받는다. 주기적으로 백그라운드에서 업데이트
    }
  );
  // 또 다른 방법으로는 type IParams = { coinId: string; }; 이렇게 인터페이스처럼 타입을 선언해두고
  // const { coinId } = useParams() as IParams; 이렇게 타입을 지정해 주는 방법이 있다. 인터페이스는 사용 불가능

  /* const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState<InfoData>();
    const [priceInfo, setPriceInfo] = useState<PriceData>();
    useEffect(() => {
        (async () => {
            const infoData = await (
                await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
            ).json();
            setInfo(infoData);
            // console.log(infoData);
            const priceData = await (
                await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
            ).json();
            setPriceInfo(priceData);
            // console.log(priceData);
            setLoading(false);
        })(); 
    }, [coinId]) */

  const loading = infoLoading || tickersLoading;

  return (
    <Container>
      <Helmet>
        <title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </title>
      </Helmet>
      <HomeBtn>
        <Link to={`${process.env.PUBLIC_URL}/`}>
          <Icon className="fas fa-arrow-left"></Icon>
        </Link>
      </HomeBtn>
      <Header>
        {/* Home에서 넘어와서 state를 같이 전달 받는다면 state의 name을 사용하고*/}
        <Title>
          {state?.name
            ? state.name
            : // 직접 url을 타고와서 state가 없다면 Loading...을 띄울건데, useEffect를 통해 API를 받을 때 loading 변수가 false가 되므로 직접 API에서 이름을 받아옴
            loading
            ? "Loading..."
            : infoData?.name}
        </Title>
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{infoData?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>${infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Price:</span>
              <span>{tickersData?.quotes?.USD?.price}</span>
            </OverviewItem>
          </Overview>
          <Description>{infoData?.description}</Description>
          <Overview>
            <OverviewItem>
              <span>Total Suply:</span>
              <span>{tickersData?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>{tickersData?.max_supply}</span>
            </OverviewItem>
          </Overview>

          <Tabs>
            <Tab isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>Chart</Link>
            </Tab>
            <Tab isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>Price</Link>
            </Tab>
          </Tabs>

          <Routes>
            {/* react-router-dom v6에서 Nested route(페이지 내부의 탭 경로)를 만드려면 
                Router.tsx에서 이 페이지의 경로에 /*을 붙여 
                명시적으로 nested route가 될 수 있음을 표시해야 한다.
                그리고 나서 자식 route에 세부 경로를 적어주면 된다. */}
            <Route path="price" element={<Price coinId={coinId as string} />} />
            <Route path="chart" element={<Chart coinId={coinId as string} />} />
          </Routes>
        </>
      )}
    </Container>
  );
}

export default Coin;
