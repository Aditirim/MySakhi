import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import womanAvatar from '../assets/logo.png'; 

const ProfileScreen = ({ navigation }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rideMonitoring, setRideMonitoring] = useState(false);
  const [notifications, setNotifications] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth().currentUser;
        if (!user) {
          Alert.alert("Error", "User not logged in");
          setLoading(false);
          return;
        }

        const userDoc = await firestore().collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          const data = userDoc.data();
          setProfileData(data);
          setRideMonitoring(data?.rideMonitoring ?? false);
          setNotifications(data?.notifications ?? false);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        Alert.alert("Error", "Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await auth().signOut();
      Alert.alert("Logged out", "You have been logged out");
      navigation.replace("LoginScreen");
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "Failed to log out");
    }
  };

  const handleToggleRideMonitoring = async () => {
    const user = auth().currentUser;
    if (!user) return;
    try {
      await firestore().collection('users').doc(user.uid).update({
        rideMonitoring: !rideMonitoring,
      });
      setRideMonitoring(!rideMonitoring);
    } catch (error) {
      console.error("Error updating ride monitoring:", error);
      Alert.alert("Error", "Failed to update preference");
    }
  };

  const handleToggleNotifications = async () => {
    const user = auth().currentUser;
    if (!user) return;
    try {
      await firestore().collection('users').doc(user.uid).update({
        notifications: !notifications,
      });
      setNotifications(!notifications);
    } catch (error) {
      console.error("Error updating notifications:", error);
      Alert.alert("Error", "Failed to update preference");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#01787aff" />
        <Text style={{ marginTop: 10, color: '#333' }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileCard}>
  <TouchableOpacity
    style={styles.editIconTopRight}
    onPress={() => navigation.navigate("EditProfile")}
  >
    <Ionicons name="create-outline" size={26} color="#003b2fff" />
  </TouchableOpacity>

 <Image source={womanAvatar} style={styles.avatarLarge} />


  <Text style={styles.profileName}>{profileData?.name ?? 'Your Name'}</Text>
  <Text style={styles.profileEmail}>{profileData?.email ?? auth().currentUser?.email}</Text>
  <Text style={styles.profileEmail}>{profileData?.phone ?? auth().currentUser?.email}</Text>
  </View>


      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.iconTitleRow}>
    <Ionicons name="call-outline" size={21} color="#374151" style={{ marginRight: 6 ,marginBottom: 6}} />
    <Text style={styles.sectionTitle}>Emergency Contacts</Text>
    </View>
         <TouchableOpacity
      onPress={() => navigation.navigate('EditEmergencyContacts')}
      style={styles.editIconBtn}
    >
      <Ionicons name="create-outline" size={22} color="#001a1cff" />
    </TouchableOpacity>

        </View>
      <View style={styles.itemRow}>
          <Ionicons name="location-outline" size={18} color="#374151" style={{ marginRight: 8,marginBottom:8 }} />
          <Text style={styles.itemText}>Home Address: <Text >Sector-52, Noida</Text></Text>
        </View>
        <View style={styles.itemRow}>
          <Ionicons name="person-outline" size={18} color="#374151" style={{ marginRight: 8 }} />
          <Text style={styles.itemText}>Phone No: {profileData?.gender ?? '9843673421'}</Text>
      </View>

      </View>

      <View style={styles.section}>
          <View style={styles.iconTitleRow}>
      <Ionicons name="settings-outline" size={20} color="#374151" style={{ marginRight: 6 ,marginBottom: 8 }} />
      <Text style={styles.sectionTitle}>Preferences</Text>
    </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Ride Monitoring</Text>
          <Switch
            value={rideMonitoring}
            onValueChange={handleToggleRideMonitoring}
            thumbColor={rideMonitoring ? "#00796b" : "#ccc"}
          />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={handleToggleNotifications}
            thumbColor={notifications ? "#00796b" : "#ccc"}
          />
        </View>
            <View style={styles.itemRow}>
        <Ionicons name="language-outline" size={18} color="#374151" style={{ marginRight: 8 ,marginBottom: 8 }} />
        <Text style={styles.itemText}>Language: English ▼</Text>
      </View>

      </View>

            <View style={styles.section}>
            <View style={styles.iconTitleRow}>
        <Ionicons name="lock-closed-outline" size={20} color="#374151" style={{ marginRight: 4,marginBottom: 10 }} />
        <Text style={styles.sectionTitle}>Security</Text>
      </View>

        <TouchableOpacity onPress={() => navigation.navigate("ChangePassword")}>
          <Text style={styles.link}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("SetupPin")}>
          <Text style={styles.link}>Setup Safety PIN</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
            <View style={styles.iconTitleRow}>
      <Ionicons name="information-circle-outline" size={22} color="#374151" style={{ marginRight: 5,marginBottom:8 }} />
      <Text style={styles.sectionTitle}>About SheRaksha</Text>
    </View>

        <TouchableOpacity onPress={() => Alert.alert("Support", "Contact us at support@sheraksha.com")}>
          <Text style={styles.link}>Contact Support</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={20} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#eafcff",
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#a6e5f1ff",
  },
  profileCard: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 25,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 10,
    elevation: 9,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  avatarLarge: {
  width: 120,
  height: 120,
  borderRadius: 75,
  marginBottom: 14,
  borderColor: '#026f62ff', 
  borderWidth: 3,          
},

  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 15,
    fontWeight:500,
    color: "#424244ff",
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },
 
  itemText: {
    fontSize: 15,
    fontWeight:400,
    color: "#29364aff",
    marginBottom: 8,
  },
  link: {
    color: "#1f19caa8",
    // fontWeight: "500",
    fontSize:16,
    marginBottom:8,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 15,
    color: "#242f3fff",
    fontWeight:400,
  },
  logoutButton: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 40,
    backgroundColor: "#d00303ff",
    borderWidth: 4,
    borderColor: "#e0e0e0ff",
  },
  logoutText: {
    color: "#ffffffff",
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 8,
  },
  editIconTopRight: {
  position: 'absolute',
  top: 12,
  right: 12,
  padding: 6,
  borderRadius: 30,
  zIndex: 10,
},
iconTitleRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 4,
},
itemRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 8,
},

});