import React, { useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { useUserContext } from "../contexts/UserContext";
import { MaterialIcons } from "@expo/vector-icons";

import { addMemberToTrainer } from "../lib/users";

import MemberModal from "./MemberModal";
import MembershipModal from "./MembershipModal";

function AddMemberButton() {
  const { user: trainer } = useUserContext();
  const [showFirst, setShowFirst] = useState(false);
  const [showSecond, setShowSecond] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [memberPhoneNumber, setMemberPhoneNumber] = useState("");
  const [membershipInfo, setMembershipInfo] = useState({
    startYear: null,
    startMonth: null,
    startDay: null,
    count: 0,
    days: {
      월: {
        checked: false,
        startHours: null,
        startMinutes: null,
        endHours: null,
        endMinutes: null,
      },
      화: {
        checked: false,
        startHours: null,
        startMinutes: null,
        endHours: null,
        endMinutes: null,
      },
      수: {
        checked: false,
        startHours: null,
        startMinutes: null,
        endHours: null,
        endMinutes: null,
      },
      목: {
        checked: false,
        startHours: null,
        startMinutes: null,
        endHours: null,
        endMinutes: null,
      },
      금: {
        checked: false,
        startHours: null,
        startMinutes: null,
        endHours: null,
        endMinutes: null,
      },
      토: {
        checked: false,
        startHours: null,
        startMinutes: null,
        endHours: null,
        endMinutes: null,
      },
      일: {
        checked: false,
        startHours: null,
        startMinutes: null,
        endHours: null,
        endMinutes: null,
      },
    },
  });

  const onPressNext = () => {
    setShowFirst(false);
    setShowSecond(true);
  };

  const onPressSave = () => {
    addMemberToTrainer(trainer.id, {
      name: memberName,
      phoneNumber: memberPhoneNumber,
      membershipInfo,
    });
    setMemberName("");
    setMemberPhoneNumber("");
    setMembershipInfo({
      startYear: null,
      startMonth: null,
      startDay: null,
      count: 0,
      days: {
        월: {
          checked: false,
          startHours: null,
          startMinutes: null,
          endHours: null,
          endMinutes: null,
        },
        화: {
          checked: false,
          startHours: null,
          startMinutes: null,
          endHours: null,
          endMinutes: null,
        },
        수: {
          checked: false,
          startHours: null,
          startMinutes: null,
          endHours: null,
          endMinutes: null,
        },
        목: {
          checked: false,
          startHours: null,
          startMinutes: null,
          endHours: null,
          endMinutes: null,
        },
        금: {
          checked: false,
          startHours: null,
          startMinutes: null,
          endHours: null,
          endMinutes: null,
        },
        토: {
          checked: false,
          startHours: null,
          startMinutes: null,
          endHours: null,
          endMinutes: null,
        },
        일: {
          checked: false,
          startHours: null,
          startMinutes: null,
          endHours: null,
          endMinutes: null,
        },
      },
    });
    setShowSecond(false);
  };

  const onPressClose = () => {
    setMemberName("");
    setMemberPhoneNumber("");
    setMembershipInfo({
      startYear: null,
      startMonth: null,
      startDay: null,
      count: 0,
      days: {
        월: {
          checked: false,
          startHours: null,
          startMinutes: null,
          endHours: null,
          endMinutes: null,
        },
        화: {
          checked: false,
          startHours: null,
          startMinutes: null,
          endHours: null,
          endMinutes: null,
        },
        수: {
          checked: false,
          startHours: null,
          startMinutes: null,
          endHours: null,
          endMinutes: null,
        },
        목: {
          checked: false,
          startHours: null,
          startMinutes: null,
          endHours: null,
          endMinutes: null,
        },
        금: {
          checked: false,
          startHours: null,
          startMinutes: null,
          endHours: null,
          endMinutes: null,
        },
        토: {
          checked: false,
          startHours: null,
          startMinutes: null,
          endHours: null,
          endMinutes: null,
        },
        일: {
          checked: false,
          startHours: null,
          startMinutes: null,
          endHours: null,
          endMinutes: null,
        },
      },
    });
    setShowFirst(false);
    setShowSecond(false);
  };

  return (
    <View style={styles.wrapper}>
      <Pressable style={styles.circle} onPress={() => setShowFirst(true)}>
        <MaterialIcons name="person-add" size={24} color="white" />
      </Pressable>
      <MemberModal
        visible={showFirst}
        onPressNext={onPressNext}
        onPressClose={onPressClose}
        memberName={memberName}
        setMemberName={setMemberName}
        memberPhoneNumber={memberPhoneNumber}
        setMemberPhoneNumber={setMemberPhoneNumber}
        membershipInfo={membershipInfo}
        setMembershipInfo={setMembershipInfo}
      />
      <MembershipModal
        visible={showSecond}
        onPressSave={onPressSave}
        onPressClose={onPressClose}
        membershipInfo={membershipInfo}
        setMembershipInfo={setMembershipInfo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 5,
    borderRadius: 27,
    height: 54,
    width: 54,
    position: "absolute",
    right: 10,
    bottom: 10,
  },
  circle: {
    backgroundColor: "royalblue",
    borderRadius: 27,
    height: 54,
    width: 54,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AddMemberButton;
