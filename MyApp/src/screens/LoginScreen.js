// // import React, { useState, useEffect } from "react";
// // import {
// //   View,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   Alert,
// //   ActivityIndicator,
// //   SafeAreaView,
// //   KeyboardAvoidingView,
// //   Platform,
// //   ScrollView,
// //   StyleSheet,
// // } from "react-native";
// // import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react-native";
// // import AsyncStorage from "@react-native-async-storage/async-storage";

// // const API_BASE = "https://bharat-pay-3.onrender.com/api";

// // export default function LoginScreen({ navigation, route }) {
// //   const [isLogin, setIsLogin] = useState(true);
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");

// //   const [formData, setFormData] = useState({
// //     name: "",
// //     email: "",
// //     password: "",
// //   });

// //   const from = route?.params?.from || "AdminPanel";

// //   // Check if already logged in
// //   // useEffect(() => {
// //   //   const checkAuth = async () => {
// //   //     try {
// //   //       const token = await AsyncStorage.getItem("token");
// //   //       if (token) {
// //   //         navigation.replace(from);
// //   //       }
// //   //     } catch (e) {
// //   //       console.log("Auth check error", e);
// //   //     }
// //   //   };
// //   //   checkAuth();
// //   // }, [navigation, from]);

// //   const handleChange = (field, value) => {
// //     setFormData({ ...formData, [field]: value });
// //     if (error) setError("");
// //   };

// //   const handleAuthSuccess = async (data) => {
// //     try {
// //       await AsyncStorage.setItem("token", data.token);
// //       await AsyncStorage.setItem("user", JSON.stringify(data.user));

// //       Alert.alert("Welcome!", "Authentication successful.");
// //       navigation.replace("AdminPanel");
// //     } catch (e) {
// //       console.error("Failed to save auth data", e);
// //       Alert.alert("Success", "Login successful!");
// //       navigation.replace("AdminPanel");
// //     }
// //   };

// //   const handleSubmit = async () => {
// //     if (!formData.email || !formData.password) {
// //       setError("Email and password are required");
// //       return;
// //     }
// //     if (!isLogin && !formData.name) {
// //       setError("Full name is required");
// //       return;
// //     }
// //     if (formData.password.length < 8) {
// //       setError("Password must be at least 8 characters");
// //       return;
// //     }

// //     setLoading(true);
// //     setError("");

// //     try {
// //       const endpoint = isLogin ? "/login" : "/register";
// //       const deviceId = "rn-device-" + Math.random().toString(36).substring(7);

// //       const body = isLogin
// //         ? { email: formData.email, password: formData.password, deviceId }
// //         : { ...formData, deviceId };

// //       const res = await fetch(`${API_BASE}${endpoint}`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(body),
// //       });

// //       const data = await res.json();

// //       if (!res.ok) throw new Error(data.message || "Authentication failed");

// //       handleAuthSuccess(data);
// //     } catch (err) {
// //       const errorMsg = err.message || "Something went wrong";
// //       setError(errorMsg);
// //       Alert.alert("Error", errorMsg);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <KeyboardAvoidingView
// //         behavior={Platform.OS === "ios" ? "padding" : "height"}
// //         style={styles.keyboardView}
// //       >
// //         <ScrollView
// //           contentContainerStyle={styles.scrollContent}
// //           keyboardShouldPersistTaps="handled"
// //         >
// //           <View style={styles.centerContainer}>
// //             <View style={styles.card}>
// //               {/* Header */}
// //               <View style={styles.header}>
// //                 <Text style={styles.logo}>Bitzo</Text>
// //                 <Text style={styles.subtitle}>
// //                   {isLogin ? "Sign in to continue" : "Create your account"}
// //                 </Text>
// //               </View>

// //               {/* Tabs */}
// //               <View style={styles.tabsContainer}>
// //                 <TouchableOpacity
// //                   style={[styles.tab, isLogin && styles.activeTab]}
// //                   onPress={() => setIsLogin(true)}
// //                 >
// //                   <Text
// //                     style={[styles.tabText, isLogin && styles.activeTabText]}
// //                   >
// //                     Login
// //                   </Text>
// //                 </TouchableOpacity>
// //                 <TouchableOpacity
// //                   style={[styles.tab, !isLogin && styles.activeTab]}
// //                   onPress={() => setIsLogin(false)}
// //                 >
// //                   <Text
// //                     style={[styles.tabText, !isLogin && styles.activeTabText]}
// //                   >
// //                     Register
// //                   </Text>
// //                 </TouchableOpacity>
// //               </View>

// //               <View style={styles.formContainer}>
// //                 {/* Error Message */}
// //                 {error ? (
// //                   <View style={styles.errorBox}>
// //                     <Text style={styles.errorText}>{error}</Text>
// //                   </View>
// //                 ) : null}

// //                 {/* Form */}
// //                 <View style={styles.form}>
// //                   {!isLogin && (
// //                     <View style={styles.inputWrapper}>
// //                       <User size={20} color="#6b7280" style={styles.icon} />
// //                       <TextInput
// //                         placeholder="Full Name"
// //                         value={formData.name}
// //                         onChangeText={(text) => handleChange("name", text)}
// //                         style={styles.input}
// //                         placeholderTextColor="#6b7280"
// //                       />
// //                     </View>
// //                   )}

// //                   <View style={styles.inputWrapper}>
// //                     <Mail size={20} color="#6b7280" style={styles.icon} />
// //                     <TextInput
// //                       placeholder="Email address"
// //                       value={formData.email}
// //                       onChangeText={(text) => handleChange("email", text)}
// //                       keyboardType="email-address"
// //                       autoCapitalize="none"
// //                       style={styles.input}
// //                       placeholderTextColor="#6b7280"
// //                     />
// //                   </View>

// //                   <View style={styles.inputWrapper}>
// //                     <Lock size={20} color="#6b7280" style={styles.icon} />
// //                     <TextInput
// //                       placeholder="Password"
// //                       value={formData.password}
// //                       onChangeText={(text) => handleChange("password", text)}
// //                       secureTextEntry={!showPassword}
// //                       style={styles.input}
// //                       placeholderTextColor="#6b7280"
// //                     />
// //                     <TouchableOpacity
// //                       onPress={() => setShowPassword(!showPassword)}
// //                       style={styles.eyeIcon}
// //                     >
// //                       {showPassword ? (
// //                         <EyeOff size={20} color="#9ca3af" />
// //                       ) : (
// //                         <Eye size={20} color="#9ca3af" />
// //                       )}
// //                     </TouchableOpacity>
// //                   </View>

// //                   {/* Submit Button */}
// //                   <TouchableOpacity
// //                     onPress={handleSubmit}
// //                     disabled={loading}
// //                     style={[styles.button, loading && styles.buttonDisabled]}
// //                   >
// //                     {loading ? (
// //                       <ActivityIndicator color="#fff" size="small" />
// //                     ) : (
// //                       <View style={styles.buttonContent}>
// //                         <Text style={styles.buttonText}>
// //                           {isLogin ? "Sign In" : "Create Account"}
// //                         </Text>
// //                         <ArrowRight size={22} color="#fff" />
// //                       </View>
// //                     )}
// //                   </TouchableOpacity>
// //                 </View>

// //                 {/* Toggle Text */}
// //                 <View style={styles.toggleContainer}>
// //                   <Text style={styles.toggleText}>
// //                     {isLogin
// //                       ? "Don't have an account? "
// //                       : "Already have an account? "}
// //                     <Text
// //                       style={styles.toggleLink}
// //                       onPress={() => setIsLogin(!isLogin)}
// //                     >
// //                       {isLogin ? "Sign up" : "Sign in"}
// //                     </Text>
// //                   </Text>
// //                 </View>
// //               </View>
// //             </View>
// //           </View>
// //         </ScrollView>
// //       </KeyboardAvoidingView>
// //     </SafeAreaView>
// //   );
// // }

// // // Styles
// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: "#0f0f0f",
// //   },
// //   keyboardView: {
// //     flex: 1,
// //   },
// //   scrollContent: {
// //     flexGrow: 1,
// //   },
// //   centerContainer: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     padding: 24,
// //   },
// //   card: {
// //     width: "100%",
// //     maxWidth: 400,
// //     backgroundColor: "#1a1a1a",
// //     borderRadius: 24,
// //     borderWidth: 1,
// //     borderColor: "#333",
// //     overflow: "hidden",
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 10 },
// //     shadowOpacity: 0.5,
// //     shadowRadius: 20,
// //     elevation: 10,
// //   },
// //   header: {
// //     padding: 40,
// //     paddingBottom: 20,
// //     alignItems: "center",
// //   },
// //   logo: {
// //     fontSize: 48,
// //     fontWeight: "bold",
// //     color: "#ef4444",
// //     letterSpacing: -2,
// //   },
// //   subtitle: {
// //     fontSize: 18,
// //     color: "#9ca3af",
// //     marginTop: 12,
// //     textAlign: "center",
// //   },
// //   tabsContainer: {
// //     flexDirection: "row",
// //     borderBottomWidth: 1,
// //     borderBottomColor: "#333",
// //   },
// //   tab: {
// //     flex: 1,
// //     paddingVertical: 16,
// //     alignItems: "center",
// //   },
// //   activeTab: {
// //     borderBottomWidth: 3,
// //     borderBottomColor: "#ef4444",
// //   },
// //   tabText: {
// //     fontSize: 16,
// //     fontWeight: "600",
// //     color: "#9ca3af",
// //   },
// //   activeTabText: {
// //     color: "#fff",
// //   },
// //   formContainer: {
// //     padding: 32,
// //     paddingTop: 24,
// //   },
// //   errorBox: {
// //     backgroundColor: "#450a0a",
// //     borderWidth: 1,
// //     borderColor: "#991b1b",
// //     padding: 16,
// //     borderRadius: 16,
// //     marginBottom: 16,
// //   },
// //   errorText: {
// //     color: "#fca5a5",
// //     textAlign: "center",
// //     fontSize: 14,
// //   },
// //   form: {
// //     gap: 20,
// //   },
// //   inputWrapper: {
// //     position: "relative",
// //   },
// //   icon: {
// //     position: "absolute",
// //     left: 16,
// //     top: 16,
// //     zIndex: 1,
// //   },
// //   input: {
// //     backgroundColor: "#121212",
// //     borderWidth: 1,
// //     borderColor: "#374151",
// //     borderRadius: 16,
// //     paddingVertical: 16,
// //     paddingHorizontal: 52,
// //     color: "#fff",
// //     fontSize: 16,
// //   },
// //   eyeIcon: {
// //     position: "absolute",
// //     right: 16,
// //     top: 16,
// //   },
// //   button: {
// //     backgroundColor: "#ef4444",
// //     paddingVertical: 16,
// //     borderRadius: 16,
// //     alignItems: "center",
// //     marginTop: 10,
// //   },
// //   buttonDisabled: {
// //     backgroundColor: "#4b5563",
// //   },
// //   buttonContent: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 8,
// //   },
// //   buttonText: {
// //     color: "#fff",
// //     fontSize: 18,
// //     fontWeight: "600",
// //   },
// //   toggleContainer: {
// //     marginTop: 20,
// //     alignItems: "center",
// //   },
// //   toggleText: {
// //     color: "#9ca3af",
// //     fontSize: 15,
// //   },
// //   toggleLink: {
// //     color: "#ef4444",
// //     fontWeight: "600",
// //   },
// // });

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
// } from "react-native";
// import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const API_BASE = "https://bharat-pay-3.onrender.com/api";

// export default function LoginScreen({ navigation, route }) {
//   const [isLogin, setIsLogin] = useState(true);
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [checkingAuth, setCheckingAuth] = useState(true);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const from = route?.params?.from || "AdminPanel";

//   // Auto-login check – runs on every mount
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const token = await AsyncStorage.getItem("token");
//         if (token) {
//           // already logged in → go straight to AdminPanel
//           navigation.replace(from);
//           return;
//         }
//       } catch (e) {
//         console.log("Auth check error", e);
//       } finally {
//         setCheckingAuth(false);
//       }
//     };
//     checkAuth();
//   }, [navigation, from]);

//   const handleChange = (field, value) => {
//     setFormData({ ...formData, [field]: value });
//     if (error) setError("");
//   };

//   const handleAuthSuccess = async (data) => {
//     try {
//       // Save token + user permanently in AsyncStorage
//       await AsyncStorage.setItem("token", data.token);
//       await AsyncStorage.setItem("user", JSON.stringify(data.user));

//       Alert.alert("Welcome!", "Authentication successful.");
//       navigation.replace("AdminPanel");
//     } catch (e) {
//       console.error("Failed to save auth data", e);
//       Alert.alert("Success", "Login successful!");
//       navigation.replace("AdminPanel");
//     }
//   };

//   const handleSubmit = async () => {
//     if (!formData.email || !formData.password) {
//       setError("Email and password are required");
//       return;
//     }
//     if (!isLogin && !formData.name) {
//       setError("Full name is required");
//       return;
//     }
//     if (formData.password.length < 8) {
//       setError("Password must be at least 8 characters");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const endpoint = isLogin ? "/login" : "/register";
//       const deviceId = "rn-device-" + Math.random().toString(36).substring(7);

//       const body = isLogin
//         ? { email: formData.email, password: formData.password, deviceId }
//         : { ...formData, deviceId };

//       const res = await fetch(`${API_BASE}${endpoint}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || "Authentication failed");

//       handleAuthSuccess(data);
//     } catch (err) {
//       const errorMsg = err.message || "Something went wrong";
//       setError(errorMsg);
//       Alert.alert("Error", errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Show loading while checking if already logged in
//   if (checkingAuth) {
//     return (
//       <SafeAreaView
//         style={[
//           styles.container,
//           { justifyContent: "center", alignItems: "center" },
//         ]}
//       >
//         <ActivityIndicator size="large" color="#ef4444" />
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={styles.keyboardView}
//       >
//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           keyboardShouldPersistTaps="handled"
//         >
//           <View style={styles.centerContainer}>
//             <View style={styles.card}>
//               {/* Header */}
//               <View style={styles.header}>
//                 <Text style={styles.logo}>Bitzo</Text>
//                 <Text style={styles.subtitle}>
//                   {isLogin ? "Sign in to continue" : "Create your account"}
//                 </Text>
//               </View>

//               {/* Tabs */}
//               <View style={styles.tabsContainer}>
//                 <TouchableOpacity
//                   style={[styles.tab, isLogin && styles.activeTab]}
//                   onPress={() => setIsLogin(true)}
//                 >
//                   <Text
//                     style={[styles.tabText, isLogin && styles.activeTabText]}
//                   >
//                     Login
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[styles.tab, !isLogin && styles.activeTab]}
//                   onPress={() => setIsLogin(false)}
//                 >
//                   <Text
//                     style={[styles.tabText, !isLogin && styles.activeTabText]}
//                   >
//                     Register
//                   </Text>
//                 </TouchableOpacity>
//               </View>

//               <View style={styles.formContainer}>
//                 {/* Error Message */}
//                 {error ? (
//                   <View style={styles.errorBox}>
//                     <Text style={styles.errorText}>{error}</Text>
//                   </View>
//                 ) : null}

//                 {/* Form */}
//                 <View style={styles.form}>
//                   {!isLogin && (
//                     <View style={styles.inputWrapper}>
//                       <User size={20} color="#6b7280" style={styles.icon} />
//                       <TextInput
//                         placeholder="Full Name"
//                         value={formData.name}
//                         onChangeText={(text) => handleChange("name", text)}
//                         style={styles.input}
//                         placeholderTextColor="#6b7280"
//                       />
//                     </View>
//                   )}

//                   <View style={styles.inputWrapper}>
//                     <Mail size={20} color="#6b7280" style={styles.icon} />
//                     <TextInput
//                       placeholder="Email address"
//                       value={formData.email}
//                       onChangeText={(text) => handleChange("email", text)}
//                       keyboardType="email-address"
//                       autoCapitalize="none"
//                       style={styles.input}
//                       placeholderTextColor="#6b7280"
//                     />
//                   </View>

//                   <View style={styles.inputWrapper}>
//                     <Lock size={20} color="#6b7280" style={styles.icon} />
//                     <TextInput
//                       placeholder="Password"
//                       value={formData.password}
//                       onChangeText={(text) => handleChange("password", text)}
//                       secureTextEntry={!showPassword}
//                       style={styles.input}
//                       placeholderTextColor="#6b7280"
//                     />
//                     <TouchableOpacity
//                       onPress={() => setShowPassword(!showPassword)}
//                       style={styles.eyeIcon}
//                     >
//                       {showPassword ? (
//                         <EyeOff size={20} color="#9ca3af" />
//                       ) : (
//                         <Eye size={20} color="#9ca3af" />
//                       )}
//                     </TouchableOpacity>
//                   </View>

//                   {/* Submit Button */}
//                   <TouchableOpacity
//                     onPress={handleSubmit}
//                     disabled={loading}
//                     style={[styles.button, loading && styles.buttonDisabled]}
//                   >
//                     {loading ? (
//                       <ActivityIndicator color="#fff" size="small" />
//                     ) : (
//                       <View style={styles.buttonContent}>
//                         <Text style={styles.buttonText}>
//                           {isLogin ? "Sign In" : "Create Account"}
//                         </Text>
//                         <ArrowRight size={22} color="#fff" />
//                       </View>
//                     )}
//                   </TouchableOpacity>
//                 </View>

//                 {/* Toggle Text */}
//                 <View style={styles.toggleContainer}>
//                   <Text style={styles.toggleText}>
//                     {isLogin
//                       ? "Don't have an account? "
//                       : "Already have an account? "}
//                     <Text
//                       style={styles.toggleLink}
//                       onPress={() => setIsLogin(!isLogin)}
//                     >
//                       {isLogin ? "Sign up" : "Sign in"}
//                     </Text>
//                   </Text>
//                 </View>
//               </View>
//             </View>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// // Styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#0f0f0f",
//   },
//   keyboardView: {
//     flex: 1,
//   },
//   scrollContent: {
//     flexGrow: 1,
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 24,
//   },
//   card: {
//     width: "100%",
//     maxWidth: 400,
//     backgroundColor: "#1a1a1a",
//     borderRadius: 24,
//     borderWidth: 1,
//     borderColor: "#333",
//     overflow: "hidden",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.5,
//     shadowRadius: 20,
//     elevation: 10,
//   },
//   header: {
//     padding: 40,
//     paddingBottom: 20,
//     alignItems: "center",
//   },
//   logo: {
//     fontSize: 48,
//     fontWeight: "bold",
//     color: "#ef4444",
//     letterSpacing: -2,
//   },
//   subtitle: {
//     fontSize: 18,
//     color: "#9ca3af",
//     marginTop: 12,
//     textAlign: "center",
//   },
//   tabsContainer: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderBottomColor: "#333",
//   },
//   tab: {
//     flex: 1,
//     paddingVertical: 16,
//     alignItems: "center",
//   },
//   activeTab: {
//     borderBottomWidth: 3,
//     borderBottomColor: "#ef4444",
//   },
//   tabText: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#9ca3af",
//   },
//   activeTabText: {
//     color: "#fff",
//   },
//   formContainer: {
//     padding: 32,
//     paddingTop: 24,
//   },
//   errorBox: {
//     backgroundColor: "#450a0a",
//     borderWidth: 1,
//     borderColor: "#991b1b",
//     padding: 16,
//     borderRadius: 16,
//     marginBottom: 16,
//   },
//   errorText: {
//     color: "#fca5a5",
//     textAlign: "center",
//     fontSize: 14,
//   },
//   form: {
//     gap: 20,
//   },
//   inputWrapper: {
//     position: "relative",
//   },
//   icon: {
//     position: "absolute",
//     left: 16,
//     top: 16,
//     zIndex: 1,
//   },
//   input: {
//     backgroundColor: "#121212",
//     borderWidth: 1,
//     borderColor: "#374151",
//     borderRadius: 16,
//     paddingVertical: 16,
//     paddingHorizontal: 52,
//     color: "#fff",
//     fontSize: 16,
//   },
//   eyeIcon: {
//     position: "absolute",
//     right: 16,
//     top: 16,
//   },
//   button: {
//     backgroundColor: "#ef4444",
//     paddingVertical: 16,
//     borderRadius: 16,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   buttonDisabled: {
//     backgroundColor: "#4b5563",
//   },
//   buttonContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   toggleContainer: {
//     marginTop: 20,
//     alignItems: "center",
//   },
//   toggleText: {
//     color: "#9ca3af",
//     fontSize: 15,
//   },
//   toggleLink: {
//     color: "#ef4444",
//     fontWeight: "600",
//   },
// });

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = "https://bharat-pay-3.onrender.com/api";

export default function LoginScreen({ navigation, route }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const from = route?.params?.from || "AdminPanel";

  // Auto-login check – runs on every mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          navigation.replace(from);
          return;
        }
      } catch (e) {
        console.log("Auth check error", e);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, [navigation, from]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (error) setError("");
  };

  const handleAuthSuccess = async (data) => {
    try {
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      Alert.alert("Welcome!", "Authentication successful.");
      navigation.replace("AdminPanel");
    } catch (e) {
      console.error("Failed to save auth data", e);
      Alert.alert("Success", "Login successful!");
      navigation.replace("AdminPanel");
    }
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }
    if (!isLogin && !formData.name) {
      setError("Full name is required");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? "/login" : "/register";
      const deviceId = "rn-device-" + Math.random().toString(36).substring(7);

      const body = isLogin
        ? { email: formData.email, password: formData.password, deviceId }
        : { ...formData, deviceId };

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Authentication failed");

      handleAuthSuccess(data);
    } catch (err) {
      const errorMsg = err.message || "Something went wrong";
      setError(errorMsg);
      Alert.alert("Error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking if already logged in
  if (checkingAuth) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#ef4444" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.centerContainer}>
            <View style={styles.card}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.logo}>Bitzo</Text>
                <Text style={styles.subtitle}>
                  {isLogin ? "Sign in to continue" : "Create your account"}
                </Text>
              </View>

              {/* Tabs */}
              <View style={styles.tabsContainer}>
                <TouchableOpacity
                  style={[styles.tab, isLogin && styles.activeTab]}
                  onPress={() => setIsLogin(true)}
                >
                  <Text
                    style={[styles.tabText, isLogin && styles.activeTabText]}
                  >
                    Login
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, !isLogin && styles.activeTab]}
                  onPress={() => setIsLogin(false)}
                >
                  <Text
                    style={[styles.tabText, !isLogin && styles.activeTabText]}
                  >
                    Register
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formContainer}>
                {/* Error Message */}
                {error ? (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                {/* Form */}
                <View style={styles.form}>
                  {!isLogin && (
                    <View style={styles.inputWrapper}>
                      <User size={20} color="#a1a1aa" style={styles.icon} />
                      <TextInput
                        placeholder="Full Name"
                        value={formData.name}
                        onChangeText={(text) => handleChange("name", text)}
                        style={styles.input}
                        placeholderTextColor="#71717a"
                      />
                    </View>
                  )}

                  <View style={styles.inputWrapper}>
                    <Mail size={20} color="#a1a1aa" style={styles.icon} />
                    <TextInput
                      placeholder="Email address"
                      value={formData.email}
                      onChangeText={(text) => handleChange("email", text)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={styles.input}
                      placeholderTextColor="#71717a"
                    />
                  </View>

                  <View style={styles.inputWrapper}>
                    <Lock size={20} color="#a1a1aa" style={styles.icon} />
                    <TextInput
                      placeholder="Password"
                      value={formData.password}
                      onChangeText={(text) => handleChange("password", text)}
                      secureTextEntry={!showPassword}
                      style={styles.input}
                      placeholderTextColor="#71717a"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      {showPassword ? (
                        <EyeOff size={20} color="#d4d4d8" />
                      ) : (
                        <Eye size={20} color="#d4d4d8" />
                      )}
                    </TouchableOpacity>
                  </View>

                  {/* Submit Button */}
                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading}
                    style={[styles.button, loading && styles.buttonDisabled]}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <View style={styles.buttonContent}>
                        <Text style={styles.buttonText}>
                          {isLogin ? "Sign In" : "Create Account"}
                        </Text>
                        <ArrowRight size={22} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                </View>

                {/* Toggle Text */}
                <View style={styles.toggleContainer}>
                  <Text style={styles.toggleText}>
                    {isLogin
                      ? "Don't have an account? "
                      : "Already have an account? "}
                    <Text
                      style={styles.toggleLink}
                      onPress={() => setIsLogin(!isLogin)}
                    >
                      {isLogin ? "Sign up" : "Sign in"}
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#1a1a1a",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#333",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    padding: 40,
    paddingBottom: 20,
    alignItems: "center",
  },
  logo: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#ef4444",
    letterSpacing: -2,
  },
  subtitle: {
    fontSize: 18,
    color: "#a1a1aa",
    marginTop: 12,
    textAlign: "center",
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#ef4444",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#a1a1aa",
  },
  activeTabText: {
    color: "#fff",
  },
  formContainer: {
    padding: 32,
    paddingTop: 24,
  },
  errorBox: {
    backgroundColor: "#450a0a",
    borderWidth: 1,
    borderColor: "#991b1b",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  errorText: {
    color: "#fca5a5",
    textAlign: "center",
    fontSize: 14,
  },
  form: {
    gap: 20,
  },
  inputWrapper: {
    position: "relative",
  },
  icon: {
    position: "absolute",
    left: 16,
    top: 16,
    zIndex: 1,
  },
  input: {
    backgroundColor: "#121212",
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 52,
    color: "#fff",
    fontSize: 16,
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 16,
  },
  button: {
    backgroundColor: "#ef4444",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#4b5563",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  toggleContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  toggleText: {
    color: "#a1a1aa",
    fontSize: 15,
  },
  toggleLink: {
    color: "#ef4444",
    fontWeight: "600",
  },
});
