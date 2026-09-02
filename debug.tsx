import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  createUser,
  deleteUser,
  getUsers,
  initDatabase,
  seedSchools,
  updateUser,
} from "./db/Database";
import {
  initReferenceDatabase,
  seedReferenceDatabase,
} from "./db/ReferenceDatabase";

export default function DebugScreen() {
  const [users, setUsers] = useState<any[]>([]);

  const handleInit = async () => {
  await initDatabase();
  await seedSchools();

  await initReferenceDatabase();
  await seedReferenceDatabase();

  console.log("✅ Main database initialized");
  console.log("✅ Reference database initialized");
};

  const handleAddUser = async () => {
    const name = `User ${Math.floor(Math.random() * 100)}`;
    const email = `user${Math.floor(Math.random() * 100)}@test.com`;
    const id = await createUser(name, email);
    console.log("✅ User added with ID:", id);
  };

  const handleGetUsers = async () => {
    const allUsers = await getUsers();
    setUsers(allUsers);
    console.log("✅ Users fetched:", allUsers);
  };

  const handleUpdateUser = async () => {
    if (users.length > 0) {
      const id = users[0].id;
      await updateUser(id, "Updated Name", "updated@email.com");
      console.log("✅ User updated");
      handleGetUsers();
    } else {
      console.log("⚠️ No users to update");
    }
  };

  const handleDeleteUser = async () => {
    if (users.length > 0) {
      const id = users[0].id;
      await deleteUser(id);
      console.log("✅ User deleted");
      handleGetUsers();
    } else {
      console.log("⚠️ No users to delete");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Database Debug Screen</Text>

      <TouchableOpacity style={styles.button} onPress={handleInit}>
        <Text style={styles.buttonText}>Initialize Database</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleAddUser}>
        <Text style={styles.buttonText}>Add User</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleGetUsers}>
        <Text style={styles.buttonText}>Get All Users</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleUpdateUser}>
        <Text style={styles.buttonText}>Update First User</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleDeleteUser}>
        <Text style={styles.buttonText}>Delete First User</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/qualifying-courses')}
      >
        <Text style={styles.buttonText}>Test: Qualifying Courses</Text>
      </TouchableOpacity>

      <View style={styles.userList}>
        <Text style={styles.userListTitle}>Users:</Text>
        {users.map((user, index) => (
          <View key={index} style={styles.userItem}>
            <Text>ID: {user.id}</Text>
            <Text>Name: {user.name}</Text>
            <Text>Email: {user.email}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  userList: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
  },
  userListTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
