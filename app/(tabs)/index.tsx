import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useState } from "react";

const getDogById = async (id:string) => {
  const response = await fetch(`https://dogapi.dog/api/v2/breeds/${id}`);
  return response.json();
};

const getDogs = async () => {
  const response = await fetch("https://dogapi.dog/api/v2/breeds");
  return response.json();
};

const getFacts = async (numFacts:number) => {
  const response = await fetch(`https://dogapi.dog/api/v2/facts?limit=${numFacts}`);
  return response.json();
};

const getGroups = async () => {
  const response = await fetch("https://dogapi.dog/api/v2/groups");
  return response.json();
};

export default function App() {
  const queryClient = new QueryClient();
  const [selectedId, setSelectedId] = useState("");

  const handleDogClicked = (id:string) => {
    setSelectedId(id);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Dogs handleDogClick={handleDogClicked} />
        <Dog dogId={selectedId} />
        <Facts numFacts={5} />
        <Groups />
      </ScrollView>
    </QueryClientProvider>
  );
}

const Groups = () => {
  const {
    data: groups,
    isLoading: groupsLoading,
    isError: groupsError,
  } = useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
  });

  if (groupsLoading) return <Text>Groups Loading...</Text>;
  if (groupsError) return <Text>Groups Error...</Text>;

  return (
    <View>
      <Text style={styles.heading}>Groups:</Text>
      {groups.data.map((group) => (
        <Text key={group.id}>{group.attributes.name}</Text>
      ))}
    </View>
  );
};

const Facts = ({ numFacts }) => {
  const {
    data: facts,
    isLoading: factsLoading,
    isError: factsError,
  } = useQuery({
    queryKey: ["facts"],
    queryFn: () => getFacts(numFacts),
  });

  if (factsLoading) return <Text>Facts Loading...</Text>;
  if (factsError) return <Text>Facts Error...</Text>;

  return (
    <View>
      <Text style={styles.heading}>Fact(s):</Text>
      {facts.data.map((fact) => (
        <Text key={fact.id}>{fact.attributes.body}</Text>
      ))}
    </View>
  );
};

const Dog = ({ dogId }) => {
  const {
    data: dog,
    isLoading: dogLoading,
    isError: dogError,
  } = useQuery({
    queryKey: ["dog", dogId],
    queryFn: () => getDogById(dogId),
  });

  if (dogLoading) return <Text>Loading...</Text>;
  if (dogError) return <Text>Error fetching item...</Text>;

  return (
    <View style={styles.dog}>
      {dog.data.attributes && (
        <View>
          <Text style={styles.heading}>{dog.data.attributes.name}</Text>
          <Text>{dog.data.attributes.description}</Text>
        </View>
      )}
    </View>
  );
};

const Dogs = ({ handleDogClick }) => {
  const {
    data: dogs,
    isLoading: dogsLoading,
    isError: dogsError,
  } = useQuery({ queryKey: ["dogs"], queryFn: getDogs });

  if (dogsLoading) {
    return <Text>Loading...</Text>;
  }

  if (dogsError) {
    return <Text>There was an error...</Text>;
  }

  return (
    <View>
      <Text style={styles.heading}>Dogs</Text>
      {dogs.data.map((d) => (
        <TouchableOpacity onPress={() => handleDogClick(d.id)} key={d.id} style={styles.button}>
          <Text style={styles.buttonText}>{d.attributes.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  dog: {
    width: "100%",
    marginVertical: 10,
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
});
