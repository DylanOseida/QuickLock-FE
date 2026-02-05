import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Collapsible from "react-native-collapsible";

type Props = {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  rightActionIcon?: keyof typeof Feather.glyphMap; // optional (e.g. "plus")
  onRightActionPress?: () => void;
};

export default function Accordion({
  title,
  defaultOpen = false,
  children,
  rightActionIcon,
  onRightActionPress,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <View style={styles.card}>
      <Pressable
        onPress={() => setOpen((v) => !v)}
        style={({ pressed }) => [styles.header, pressed && { opacity: 0.9 }]}
      >
        <Text style={styles.title}>{title}</Text>

        <View style={styles.right}>
          {/* optional right action (like your "Cards +" header) */}
          {rightActionIcon ? (
            <Pressable
              onPress={(e) => {
                // prevent toggling when pressing right icon
                e.stopPropagation?.();
                onRightActionPress?.();
              }}
              hitSlop={10}
              style={styles.iconBtn}
            >
              <Feather name={rightActionIcon} size={18} color="rgba(233,244,255,0.95)" />
            </Pressable>
          ) : (
            <Feather
              name={open ? "minus" : "plus"}
              size={18}
              color="rgba(233,244,255,0.95)"
            />
          )}
        </View>
      </Pressable>

      <Collapsible collapsed={!open}>
        <View style={styles.content}>{children}</View>
      </Collapsible>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    overflow: "hidden",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "rgba(255,255,255,0.14)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#E9F4FF",
    fontSize: 20,
    fontWeight: "700",
  },
  right: {
    minWidth: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: "5%",
    paddingVertical: "3%",
    gap: 10,
  },
});
