import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import Collapsible from "react-native-collapsible";

type Props = {
  title: string;
  defaultOpen?: boolean;
  alwaysOpen?: boolean;
  children?: React.ReactNode;

  rightActionIcon?: keyof typeof Feather.glyphMap;
  onRightActionPress?: () => void;

  onPress?: () => void; // NEW for link rows

  variant?: "plusminus" | "toggle" | "link";
};

export default function Accordion({
  title,
  defaultOpen = false,
  alwaysOpen = false,
  children,
  rightActionIcon,
  onRightActionPress,
  onPress,
  variant = "plusminus",
}: Props) {
  const isLink = variant === "link";

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isLink && defaultOpen) {
      requestAnimationFrame(() => setOpen(true));
    }
  }, [defaultOpen, isLink]);

  const toggleOpen = () => {
    if (alwaysOpen || isLink) return;
    setOpen((v) => !v);
  };

  const handleHeaderPress = () => {
    if (isLink) {
      onPress?.();
      return;
    }
    toggleOpen();
  };

  return (
    <View style={[styles.card, variant === "toggle" && styles.toggleCard]}>
      <Pressable
        onPress={handleHeaderPress}
        style={({ pressed }) => [styles.header, pressed && { opacity: 0.9 }]}
      >
        <Text style={styles.title}>{title}</Text>

        <View style={styles.right}>
          {variant === "toggle" ? (
            <Switch
              value={!open}
              onValueChange={(isClosed) => setOpen(!isClosed)}
              trackColor={{
                false: "rgba(233,244,255,0.22)",
                true: "rgba(207,231,245,0.45)",
              }}
              thumbColor={
                Platform.OS === "android"
                  ? "rgba(233,244,255,0.95)"
                  : undefined
              }
              ios_backgroundColor="rgba(233,244,255,0.22)"
            />
          ) : isLink ? (
            <Feather
              name="chevron-right"
              size={20}
              color="rgba(233,244,255,0.95)"
            />
          ) : rightActionIcon ? (
            <Pressable
              onPress={(e) => {
                e.stopPropagation?.();
                onRightActionPress?.();
              }}
              hitSlop={10}
              style={styles.iconBtn}
            >
              <Feather
                name={rightActionIcon}
                size={18}
                color="rgba(233,244,255,0.95)"
              />
            </Pressable>
          ) : !alwaysOpen ? (
            <Feather
              name={open ? "minus" : "plus"}
              size={18}
              color="rgba(233,244,255,0.95)"
            />
          ) : null}
        </View>
      </Pressable>

      {/* Only render content if children exist AND not a link */}
      {!isLink && children != null && (
        alwaysOpen ? (
          <View style={styles.content}>{children}</View>
        ) : (
          <Collapsible collapsed={!open} align="top">
            <View style={styles.content}>{children}</View>
          </Collapsible>
        )
      )}
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
  toggleCard: {
    width: "100%",
    alignSelf:"center",
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
