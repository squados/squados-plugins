import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const items = ["Revisar a proposta", "Preparar o relatório", "Planejar a semana"];
export default function App() {
  const [selected, setSelected] = useState<number[]>([]);
  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.brand}>PULSO / TASKS</Text>
        <Text style={styles.title}>Tarefas para{"\n"}um dia melhor.</Text>
        <Text style={styles.subtitle}>Uma lista de tarefas no celular.</Text>
        <View style={styles.summary}>
          <Text style={styles.summaryNumber}>{selected.length}</Text>
          <Text style={styles.summaryLabel}>tarefas concluídas</Text>
        </View>
        {items.map((item, index) => (
          <Pressable
            key={item}
            accessibilityRole="button"
            onPress={() =>
              setSelected(
                selected.includes(index)
                  ? selected.filter((value) => value !== index)
                  : [...selected, index],
              )
            }
            style={[styles.row, selected.includes(index) && styles.selected]}
          >
            <Text style={styles.rowNumber}>
              {selected.includes(index) ? "✓" : String(index + 1).padStart(2, "0")}
            </Text>
            <Text style={styles.rowText}>{item}</Text>
          </Pressable>
        ))}
        <Text style={styles.footer}>Uma base para o seu próximo aplicativo.</Text>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f4f1e9" },
  content: { padding: 28, paddingTop: 64, gap: 20 },
  brand: { fontSize: 11, letterSpacing: 2, fontWeight: "700", color: "#52735b" },
  title: { fontSize: 43, fontWeight: "600", letterSpacing: -1.5, lineHeight: 46, color: "#213a2a" },
  subtitle: { fontSize: 16, lineHeight: 25, color: "#637467" },
  summary: { paddingVertical: 28, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#ccd7cc" },
  summaryNumber: { fontSize: 58, color: "#213a2a" },
  summaryLabel: { fontSize: 13, color: "#52735b" },
  row: {
    paddingVertical: 20,
    flexDirection: "row",
    gap: 16,
    borderBottomWidth: 1,
    borderColor: "#d5dcd2",
  },
  selected: { backgroundColor: "#e2ebdc" },
  rowNumber: { fontSize: 14, color: "#52735b", minWidth: 24 },
  rowText: { fontSize: 16, color: "#213a2a", flex: 1 },
  footer: { fontSize: 12, lineHeight: 20, color: "#78877a", marginTop: 20 },
});
