import React from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { fetchCoins } from "../api";
import { isDarkAtom } from "../atoms";

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

const ModeBtn = styled.div`
  float: right;
  position: absolute;
  border-radius: 12px;
  width: 30px;
  border: 0;
  margin: 7vh 0px;
  font-size: 22px;
`;

const Icon = styled.i`
  color: ${(props) => props.theme.accentColor};
  transition: all 300ms ease;
  &:hover {
    transform: rotate(-30deg) scale(1.1);
    color: ${(props) => props.theme.textColor};
  }
`;

const CoinList = styled.ul``;

const Coin = styled.li`
  background-color: ${(props) => props.theme.cardBgColor};
  color: ${(props) => props.theme.textColor};
  margin-bottom: 10px;
  border-radius: 15px;
  border: 1px solid white;
  a {
    padding: 20px;
    transition: color 0.2s ease-in;
    display: flex;
    align-items: center;
  }
  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Img = styled.img`
  width: 35px;
  height: 35px;
  margin-right: 10px;
`;

interface ICoin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

function Coins() {
  const isDark = useRecoilValue(isDarkAtom);
  // Recoil의 Atom값을 set할 수 있는 펑션
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  // setDarkAtom 값을 받아서 반대로 돌리는 함수
  const toggleDarkAtom = () => setDarkAtom((prev) => !prev);

  // useQuery는 api.ts에 있는 fetchCoins라는 fetch 함수를 작동시키고,
  // 그것이 로딩 중이라면 isLoading에 불린 값을 리턴. 로딩이 끝나면 data에 json의 promise 값을 리턴.
  // 이 방법을 사용하면 코인 상세 정보에 들어갔다 나올 때 로딩이 없이 바로 리스트가 뜨는데
  // 그 이유는 바로 react query가 데이터를 캐시에 저장해두기 때문. react query는 데이터를 파괴하지 않아
  const { isLoading, data } = useQuery<ICoin[]>("allCoins", fetchCoins);

  /* const [coins, setCoins] = useState<ICoin[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect (() => {
        (async() => {
            const response = await fetch("https://api.coinpaprika.com/v1/coins");
            const json = await response.json();
            setCoins(json.slice(0, 100));
            setLoading(false);
        })(); 
    }, [])
    console.log(coins); */

  return (
    <Container>
      <Helmet>
        <title>Coin Tracker</title>
      </Helmet>
      {/* 이전 값을 가져와서 반대로 돌리는 함수 */}
      <ModeBtn onClick={toggleDarkAtom}>
        {isDark ? (
          <Icon className="far fa-moon"></Icon>
        ) : (
          <Icon className="far fa-sun"></Icon>
        )}
      </ModeBtn>
      <Header>
        <Title>Coin</Title>
      </Header>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <CoinList>
          {data?.slice(0, 100).map((coin) => (
            <Coin key={coin.id}>
              <Link to={`/${coin.id}`} state={{ name: coin.name }}>
                <Img
                  src={`https://cryptoicon-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}
                />
                {coin.name} &rarr;
              </Link>
            </Coin>
          ))}
        </CoinList>
      )}
    </Container>
  );
}

export default Coins;
