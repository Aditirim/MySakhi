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
import { auth, db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileScreen = ({ navigation }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rideMonitoring, setRideMonitoring] = useState(false);
  const [notifications, setNotifications] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("Current user:", auth.currentUser);
        if (!auth.currentUser) {
          Alert.alert("Error", "User not logged in");
          setLoading(false);
          return;
        }

        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData(data);
          setRideMonitoring(data.rideMonitoring ?? false);
          setNotifications(data.notifications ?? false);
          console.log("Profile data loaded:", data);
        } else {
          console.log("No profile document found, showing empty profile.");
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
      await signOut(auth);
      Alert.alert("Logged out", "You have been logged out");
      navigation.replace("Login"); // adjust if you use different login screen name
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "Failed to log out");
    }
  };

  const handleToggleRideMonitoring = async () => {
    try {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(docRef, { rideMonitoring: !rideMonitoring });
      setRideMonitoring(!rideMonitoring);
    } catch (error) {
      console.error("Error updating ride monitoring:", error);
      Alert.alert("Error", "Failed to update preference");
    }
  };

  const handleToggleNotifications = async () => {
    try {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(docRef, { notifications: !notifications });
      setNotifications(!notifications);
    } catch (error) {
      console.error("Error updating notifications:", error);
      Alert.alert("Error", "Failed to update preference");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d63384" />
        <Text style={{ marginTop: 10, color: '#333' }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: profileData?.photoURL ?? 'https://i.ibb.co/4pDNDk1/avatar.png' }}
          style={styles.avatar}
        />
        <View style={styles.headerText}>
          <Text style={styles.name}>{profileData?.name ?? 'Your Name'}</Text>
          <Text style={styles.email}>{profileData?.email ?? auth.currentUser?.email}</Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditProfile")} // make sure you have EditProfile screen
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚨 Emergency Contacts</Text>
        <TouchableOpacity onPress={() => navigation.navigate("EditContacts")}>
          <Text style={styles.editLink}>Edit</Text>
        </TouchableOpacity>
        <Text style={styles.itemText}>📍 Home Address: <Text style={styles.link}>Set Location</Text></Text>
        <Text style={styles.itemText}>👤 Gender: {profileData?.gender ?? 'Not Set'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Preferences</Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Ride Monitoring</Text>
          <Switch
            value={rideMonitoring}
            onValueChange={handleToggleRideMonitoring}
            thumbColor={rideMonitoring ? "#d63384" : "#ccc"}
          />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={handleToggleNotifications}
            thumbColor={notifications ? "#d63384" : "#ccc"}
          />
        </View>
        <Text style={styles.itemText}>🌐 Language: English ▼</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔒 Security</Text>
        <TouchableOpacity onPress={() => navigation.navigate("ChangePassword")}>
          <Text style={styles.link}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("SetupPin")}>
          <Text style={styles.link}>Setup Safety PIN</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ About SheRaksha</Text>
        <TouchableOpacity onPress={() => Alert.alert("Support", "Contact us at support@sheraksha.com")}>
          <Text style={styles.link}>Contact Support</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={20} color="#d63384" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0fdf4',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#d63384',
  },
  headerText: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d63384',
  },
  email: {
    fontSize: 14,
    color: '#555',
  },
  editButton: {
    backgroundColor: '#d63384',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  editLink: {
    position: 'absolute',
    right: 15,
    top: 15,
    color: '#0d6efd',
    fontSize: 14,
  },
  itemText: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  link: {
    color: '#0d6efd',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  switchLabel: {
    fontSize: 14,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d63384',
  },
  logoutText: {
    marginLeft: 6,
    color: '#d63384',
    fontWeight: 'bold',
  },
});
