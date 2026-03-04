import Feather from "@expo/vector-icons/Feather";
import DateTimePicker from "@react-native-community/datetimepicker";
import Checkbox from "expo-checkbox";
import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

type PickerMode = "date" | "time";
type ActiveField = "start" | "end" | null;

export default function DateTime() {
  const midnightDate = new Date(new Date().setHours(0,0,0,0));
  const [startValue, setStartValue] = useState(midnightDate);
  const [endValue, setEndValue] = useState(midnightDate);

  const [isChecked, setChecked] = useState(false);

  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<PickerMode>("date");
  const [activeField, setActiveField] = useState<ActiveField>(null);

  const openOrTogglePicker = (field: Exclude<ActiveField, null>, mode: PickerMode) => {
    // If user clicks same field + same mode while open => close
    if (showPicker && activeField === field && pickerMode === mode) {
      setShowPicker(false);
      return;
    }

    // Otherwise open picker for this field/mode (also swaps date <-> time)
    setActiveField(field);
    setPickerMode(mode);
    setShowPicker(true);
  };

  const onChangePicker = (event: any, selected?: Date) => {
    // Android: close after pick or dismiss
    if (Platform.OS !== "ios") setShowPicker(false);

    if (!selected) return;

    if (activeField === "start") setStartValue(selected);
    if (activeField === "end") setEndValue(selected);
  };

  const renderPicker = () => (
    <View style={styles.pickerWrapper}>
      <DateTimePicker
        value={activeField === "end" ? endValue : startValue}
        mode={pickerMode}
        display={Platform.OS === "ios" ? "spinner" : "default"}
        onChange={onChangePicker}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* START */}
      <View style={styles.section}>
        <Text style={styles.title}>Start Date & Time: </Text>

        <View style={styles.rowButtons}>
          <Pressable
            onPress={() => openOrTogglePicker("start", "date")}
            style={styles.button}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>{startValue.toLocaleDateString()}</Text>
              <Feather name="calendar" size={24} color="white" />
            </View>
          </Pressable>

          <Pressable
            onPress={() => openOrTogglePicker("start", "time")}
            style={styles.button}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>
                {startValue.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>
              <Feather name="clock" size={24} color="white" />
            </View>
          </Pressable>
        </View>

        {/* Picker appears under START row when activeField === "start" */}
        {showPicker && activeField === "start" && renderPicker()}
      </View>

      {/* CHECKBOX */}
      <View style={styles.checkboxContainer}>
        <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setChecked} color={isChecked ? 'rgba(255,255,255,0.14)' : undefined}/>
        <Text style={styles.checkboxText}>Set End Date</Text>
      </View>

      {/* END (only show when checked) */}
      {isChecked && (
        <View style={styles.section}>
          <Text style={styles.title}>End Date & Time: </Text>

          <View style={styles.rowButtons}>
            <Pressable
              onPress={() => openOrTogglePicker("end", "date")}
              style={styles.button}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>{endValue.toLocaleDateString()}</Text>
                <Feather name="calendar" size={24} color="white" />
              </View>
            </Pressable>

            <Pressable
              onPress={() => openOrTogglePicker("end", "time")}
              style={styles.button}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>
                  {endValue.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Text>
                <Feather name="clock" size={24} color="white" />
              </View>
            </Pressable>
          </View>

          {/* Picker appears under END row when activeField === "end" */}
          {showPicker && activeField === "end" && renderPicker()}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  section: {
    flexDirection: "column",
    marginBottom: 14,
  },

  title: {
    fontSize: 16,
    color: "white",
  },

  rowButtons: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  button: {
    width: "46%",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  buttonText: {
    color: "#E9F4FF",
    fontSize: 16,
  },

  pickerWrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  checkbox: {
    marginRight: 8,
    color: "black",
  },

  checkboxText: {
    color: "white",
  },
});