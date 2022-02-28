import React, { useCallback, useEffect, useState } from "react";
import {  ActivityIndicator } from 'react-native';
import { VictoryPie } from 'victory-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { HistoryCard } from "../../components/HistoryCard";

import { 
  Container,
  LoadContainer,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month
} from "./styles";
import { categories } from "../../utils/categories";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from 'styled-components';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../hooks/auth";

interface TransactionData {
  type: 'positive' | 'negative';
	name: string;
	amount: string;
	category: string;
	date: string;
}

interface CategoryData {
  key: string;
  name: string;
  total: number;
  totalFormatted: string;
  color: string;
  x: string;
  y: number;
}

export function Resume() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectDate] = useState( new Date()); 
  const [totalByCategories, setTotalByCategories ] = useState<CategoryData[]>([]);
  
  const theme = useTheme();
  const { user } = useAuth();

  function handleDateChange(action: 'next' | 'preview') {
    if(action === 'next'){
      setSelectDate(addMonths(selectedDate, 1));
    }else {
      setSelectDate(subMonths(selectedDate, 1));
    }
  }

  async function loadData() {
    setIsLoading(true);

    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    const expensives = responseFormatted
      .filter((expensive: TransactionData) => 
        expensive.type === 'negative' && 
        new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
        new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
      );

    const expensivesTotal = expensives
      .reduce((acumullator: number, expensive: TransactionData) => {
        return acumullator + Number(expensive.amount);
    }, 0);

    const totalByCategory: CategoryData[] = [];

    categories.forEach(category => {
      let categorySum = 0;

      expensives.forEach((expensive: TransactionData) => {
        if(expensive.category == category.key) {
          categorySum += Number(expensive.amount);
        }
      });

      if(categorySum > 0){
        const totalFormatted = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });

        const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`;

        totalByCategory.push({
          key: category.key,
          name: category.name,
          total: categorySum,
          totalFormatted,
          color: category.color,
          x: percent,
          y: categorySum
        });
      }
    });

    setTotalByCategories(totalByCategory);
    setIsLoading(false);
  }
  
  useFocusEffect(useCallback(() => {
    loadData();
  }, [selectedDate]));

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      {isLoading ? 
        <LoadContainer>
          <ActivityIndicator 
            color={theme.colors.primary}
            size='large'
          />
        </LoadContainer> :
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: useBottomTabBarHeight(),
          }}
        >
          <MonthSelect>
            <MonthSelectButton onPress={() => handleDateChange('preview')}>
              <MonthSelectIcon name="chevron-left" />
            </MonthSelectButton>

            <Month>{format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}</Month>

            <MonthSelectButton onPress={() => handleDateChange('next')}>
              <MonthSelectIcon name="chevron-right" />
            </MonthSelectButton>
          </MonthSelect>
          <ChartContainer>
            {totalByCategories && (
              <VictoryPie 
                data={totalByCategories}
                colorScale={totalByCategories.map(category => category.color)}
                style={{
                  labels: { 
                    fontSize: RFValue(18),
                    fontWeight: 'bold', 
                    fill: theme.colors.shape,
                  }
                }}
                labelRadius={50}
              />        
            )}
          </ChartContainer>

          {totalByCategories.map(item => (
              <HistoryCard 
                key={item.key}
                title={item.name}
                amount={item.totalFormatted}
                color={item.color}
              />
            )) 
          }
        </Content>
      }
    </Container>
  )
}