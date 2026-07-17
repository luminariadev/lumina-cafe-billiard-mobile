import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen({ navigation }: any) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  async function handleLogin() {
    if (!username || !password) {
      setError("Username dan password wajib diisi");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(username, password);
    } catch (e: any) {
      setError(e.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.card}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoIcon}>🎱</Text>
          <Text style={styles.logoText}>Lumina Cafe</Text>
          <Text style={styles.logoSubtext}>Billiard</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#6b7280"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#6b7280"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>MASUK</Text>
          )}
        </TouchableOpacity>

        <View style={styles.roleInfo}>
          <Text style={styles.roleText}>Demo: admin / admin123</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d2818",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#143d28",
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: "#1a4d33",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoIcon: { fontSize: 64, marginBottom: 8 },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#c9a84c",
  },
  logoSubtext: {
    fontSize: 16,
    color: "#9ca3af",
    marginTop: 4,
  },
  input: {
    backgroundColor: "#0d2818",
    borderRadius: 10,
    padding: 16,
    color: "#fff",
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1a4d33",
  },
  button: {
    backgroundColor: "#c9a84c",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    color: "#0d2818",
    fontSize: 16,
    fontWeight: "bold",
  },
  error: {
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 8,
  },
  roleInfo: {
    alignItems: "center",
    marginTop: 16,
  },
  roleText: {
    color: "#6b7280",
    fontSize: 12,
  },
});
