import { useEffect, useState } from "react";
import { VStack, HStack, useTheme, Text, ScrollView, Box } from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import {
  CircleWavyCheck,
  ClipboardText,
  DesktopTower,
  Hourglass,
} from "phosphor-react-native";

import { Header } from "../components/Header";
import { OrderProps } from "../components/Order";
import { Loading } from "../components/Loading";
import { Button } from "../components/Button";
import { OrderFirestoreDTO } from "../DTOs/OrderDTO";
import { dateFormat } from "../utils/firestoreDateFormat";
import { CardDetails } from "../components/CardDetails";
import { Input } from "../components/Input";
import { Alert } from "react-native";

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
};

type RouteParams = {
  orderId: string;
};

export function Details() {
  const [isLoading, setIsloading] = useState(true);
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);
  const [solution, setsolution] = useState("");

  const { colors } = useTheme();
  const route = useRoute();
  const { orderId } = route.params as RouteParams;
  const navigation = useNavigation();

  function handleOrderClose() {
    if (!solution) {
      return Alert.alert(
        "Solicitação",
        "Informe uma solução para encerrar a solicitação."
      );
    }

    firestore()
      .collection("orders")
      .doc(orderId)
      .update({
        status: "closed",
        solution: solution,
        closed_at: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        navigation.goBack();
        return Alert.alert("Solicitação", "Solicitação encerrada.");
      })
      .catch((error) => {
        console.log(error);
        return Alert.alert(
          "Solicitação",
          "Não foi possível encerrar a solicitação"
        );
      });
  }

  useEffect(() => {
    const fetchDoc = async () => {
      const doc = await firestore()
        .collection<OrderFirestoreDTO>("orders")
        .doc(orderId)
        .get();

      const { patrimony, description, status, create_at, closed_at, solution } =
        doc.data();

      const closed = closed_at ? dateFormat(closed_at) : null;

      setOrder({
        id: doc.id,
        patrimony,
        description,
        status,
        when: dateFormat(create_at),
        closed,
        solution,
      });
      setIsloading(false);
    };
    fetchDoc();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bg="gray.700">
      <Box px={6} bg="gray.600">
        <Header title="Solicitação" />
      </Box>

      <HStack bg="gray.500" justifyContent="center" p={4}>
        {order.status === "closed" ? (
          <CircleWavyCheck size={22} color={colors.green[300]} />
        ) : (
          <Hourglass size={22} color={colors.green[300]} />
        )}

        <Text
          fontSize={"sm"}
          color={
            order.status === "closed"
              ? colors.green[300]
              : colors.secondary[700]
          }
          ml={2}
          textTransform="uppercase"
        >
          {order.status === "closed" ? "finalizado" : "em andamento"}
        </Text>
      </HStack>

      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails
          title="equipamento"
          description={`Patrimônio ${order.patrimony}`}
          icon={DesktopTower}
        />
        <CardDetails
          title="descrição do problema"
          description={`${order.description}`}
          icon={ClipboardText}
          footer={`Registrado em ${order.when}`}
        />
        <CardDetails
          title="solução"
          icon={CircleWavyCheck}
          description={order.solution} //solution
          footer={order.closed && `Encerrado em ${order.closed}`}
        >
          {order.status === "open" && (
            <Input
              placeholder="Descrição da solução"
              onChangeText={setsolution}
              textAlignVertical="top"
              multiline
              h={24}
            />
          )}
        </CardDetails>
      </ScrollView>
      {order.status === "open" && (
        <Button title="Encerrar solicitção" m={5} onPress={handleOrderClose} />
      )}
    </VStack>
  );
}
