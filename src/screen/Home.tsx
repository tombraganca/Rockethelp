import { useState, useEffect } from "react";
import {
  VStack,
  HStack,
  IconButton,
  useTheme,
  Text,
  Heading,
  FlatList,
  Center,
} from "native-base";
import { Alert } from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { SignOut, ChatTeardropText } from "phosphor-react-native";

import Logo from "./../assets/logo_secondary.svg";

import { Filter } from "../components/Filter";
import { Button } from "../components/Button";
import { Loading } from "../components/Loading";
import { Order, OrderProps } from "../components/Order";
import { dateFormat } from "../utils/firestoreDateFormat";

export function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [statusSelected, setStatusSelected] = useState<"open" | "closed">(
    "open"
  );
  const [orders, setOrders] = useState<OrderProps[]>([]);

  const navigate = useNavigation();
  const { colors } = useTheme();

  function handleNewOrder() {
    navigate.navigate("new");
  }

  function handleOpenDetails(orderId: string) {
    navigate.navigate("details", { orderId });
  }

  async function handleLogout() {
    try {
      await auth().signOut();
    } catch (error) {
      Alert.alert("Sair", "Não foi possível desconectar.");
    }
  }

  useEffect(() => {
    setIsLoading(true);
    const subscription = firestore()
      .collection("orders")
      .where("status", "==", statusSelected)
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const { patrimony, description, status, create_at } = doc.data();
          return {
            id: doc.id,
            patrimony,
            description,
            status,
            when: dateFormat(create_at),
          };
        });

        setOrders(data);
        setIsLoading(false);
      });

    return subscription;
  }, [statusSelected]);

  return (
    <VStack flex={1} pb={6} bg="gray.700">
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pt={12}
        pb={5}
        px={6}
      >
        <Logo />

        <IconButton
          icon={<SignOut size={26} color={colors.gray[300]} />}
          onPress={handleLogout}
        />
      </HStack>

      <VStack flex={1} px={6}>
        <HStack
          w="full"
          mt={8}
          mb={4}
          justifyContent="space-between"
          alignContent="center"
          color="gray.700"
        >
          <Heading color={"gray.200"} fontSize="lg">Solicitações</Heading>
          <Text color={"gray.200"}>{orders.length}</Text>
        </HStack>

        <HStack space={3} marginBottom={8}>
          <Filter
            type="open"
            title="Em andamento"
            onPress={() => setStatusSelected("open")}
            isActive={statusSelected === "open"}
          />
          <Filter
            type="closed"
            title="Finalizados"
            onPress={() => setStatusSelected("closed")}
            isActive={statusSelected === "closed"}
          />
        </HStack>

        {isLoading ? (
          <Loading />
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Order data={item} onPress={() => handleOpenDetails(item.id)} />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={() => (
              <Center>
                <ChatTeardropText color={colors.gray[300]} size={40} />
                <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                  Você não possui {"\n"} solicitações{" "}
                  {statusSelected === "open" ? "em andamento" : "finalizado"}
                </Text>
              </Center>
            )}
          />
        )}

        <Button title="Nova Solicitação" onPress={handleNewOrder} />
      </VStack>
    </VStack>
  );
}
