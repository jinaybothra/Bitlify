import React, { useState } from 'react'
import HTMLReactParser from "html-react-parser";
import { useParams } from 'react-router-dom'
import millify from 'millify'
import { Col, Row, Typography, Select } from 'antd'
import { MoneyCollectOutlined, DollarCircleOutlined, FundOutlined, ExclamationCircleOutlined, StopOutlined, TrophyOutlined, CheckOutlined, NumberOutlined, ThunderboltOutlined } from '@ant-design/icons';
import Loading from './Loading';
import { useGetCryptoDetailsQuery, useGetCryptoHistoryQuery } from '../servicesapis/cryptoApis';
import Design from './Design';

const { Title, Text } = Typography
const { Option } = Select

const CryptoDetails = () => {
  const { coinId } = useParams()
  const [timePeriod, setTimePeriod] = useState('7d')
  const { data, isFetching } = useGetCryptoDetailsQuery(coinId)  
  const { data: coinHistory} = useGetCryptoHistoryQuery({coinId, timePeriod})  
  const cryptoDetails = data?.data?.coin

  
  
  const time = ['3h', '24h', '7d', '30d', '1y', '3m', '3y', '5y'];


  if(isFetching) return <Loading />;
  const stats = [
    { title: 'Price to USD', value: `$ ${cryptoDetails.price && millify(cryptoDetails.price)}`, icon: <DollarCircleOutlined /> },
    { title: 'Rank', value: cryptoDetails.rank, icon: <NumberOutlined /> },
    { title: '24h Volume', value: `$ ${cryptoDetails['24hVolume'] && millify(cryptoDetails['24hVolume'])}`, icon: <ThunderboltOutlined /> },
    { title: 'Market Cap', value: `$ ${cryptoDetails.marketCap && millify(cryptoDetails.marketCap)}`, icon: <DollarCircleOutlined /> },
    { title: 'All-time-high(daily avg.)', value: `$ ${millify(cryptoDetails.allTimeHigh.price)}`, icon: <TrophyOutlined /> },
  ];

  const genericStats = [
    { title: 'Markets', value: cryptoDetails.numberOfMarkets, icon: <FundOutlined /> },
    { title: 'Exchanges', value: cryptoDetails.numberOfExchanges, icon: <MoneyCollectOutlined /> },
    { title: 'Approved Supply', value: cryptoDetails.supply.confirmed ? <CheckOutlined /> : <StopOutlined />, icon: <ExclamationCircleOutlined /> },
    { title: 'Total Supply', value: `$ ${millify(cryptoDetails.supply.total)}`, icon: <ExclamationCircleOutlined /> },
    { title: 'Circulating Supply', value: `$ ${millify(cryptoDetails.supply.circulating)}`, icon: <ExclamationCircleOutlined /> },
  ];
  console.log(cryptoDetails)

  return (
    <Col className="coin-detail">
      <Col className='coin-heading'>
        <Title level={2} className='coin-name'>
          {cryptoDetails.name} ({cryptoDetails.symbol}) Price
        </Title>
        <p>
          {cryptoDetails.name} live price in US dollars
          View value statistics, market cap and supply
        </p>
      </Col>
      <Select
        defaultValue="7d"
        className='select-timeperiod'
        placeholder="Select Time Period"
        onChange={(value) => {
          setTimePeriod(value)
        }}
      >
        {time.map((date) => <Option key={date}>{date}</Option>)}
        
      </Select>

      <Design coinColor={cryptoDetails.color} coinHistory={coinHistory} currentPrice = {millify(cryptoDetails.price)} coinName={cryptoDetails.name}/>
        
      <br />
      <Col className='stats-container'>
        <Col className='coin-value'>
          <Col className='coin-value-heading'>
            <Title level={3} className='coin-details-heading'>{cryptoDetails.name} Value Statistics</Title>
            <p>An overview showing the statistics of {cryptoDetails.name}, such as the base and quote currency, the rank, and trading value.</p>
          </Col>
          {stats.map(({icon, title, value}, index) => (
            <Col key={index+5} className='coin-stats'>
              <Col className='coin-stats-name'>
                <Text>{icon}</Text>
                <Text>{title}</Text>
              </Col>
              <Text className='stats'>{value}</Text>
            </Col>
          ))}
        </Col>
        <Col className='other-stats-info'>
          <Col className='coin-value-heading'>
            <Title level={3} className='coin-details-heading'> Other Statistics</Title>
            <p>An overview showing the statistics of all cryptocurrencies.</p>
          </Col>
          {genericStats.map(({icon, title, value}, index) => (
            <Col key={index} className='coin-stats'>
              <Col className='coin-stats-name'>
                <Text>{icon}</Text>
                <Text>{title}</Text>
              </Col>
              <Text className='stats'>{value}</Text>
            </Col>
          ))}
        </Col>
      </Col>

      <Col className='coin-desc-link'>
        <Row className='coin-desc'>
            <Title level={3} className='coin-details-heading'>
              What is {cryptoDetails.name}? <br/>
              <p style={{marginTop: "20px"}}>
                {HTMLReactParser(cryptoDetails.description)}
              </p>
              </Title>
              
        </Row>
        
        <Col className='coin-links'>
          <Title level={3} className='coin-details'>
            {cryptoDetails.name} Links
          </Title>
          {cryptoDetails.links.map((link) => (
            <Row key={link.name} className='coin-link'>
              <Title level={5} className='link-name'>
                {link.type}
              </Title>
              <a href={link.url} target='_blank' rel="noreferrer">
                {link.name}
              </a>
            </Row>
          ))}
        </Col>
      </Col>
    </Col>
  )
}

export default CryptoDetails