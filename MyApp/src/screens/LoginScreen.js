// // // // import React, { useState, useEffect } from "react";
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   TextInput,
// // // //   TouchableOpacity,
// // // //   Alert,
// // // //   ActivityIndicator,
// // // //   SafeAreaView,
// // // //   KeyboardAvoidingView,
// // // //   Platform,
// // // //   ScrollView,
// // // // } from "react-native";
// // // // import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react-native";
// // // // import { GoogleSignin, GoogleSigninButton, statusCodes } from "@react-native-google-signin/google-signin";
// // // // import AsyncStorage from "@react-native-async-storage/async-storage";

// // // // const API_BASE = "https://bitzo-server-1.onrender.com/api";

// // // // export default function LoginScreen({ navigation, route }) {
// // // //   const [isLogin, setIsLogin] = useState(true);
// // // //   const [showPassword, setShowPassword] = useState(false);
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [error, setError] = useState("");
// // // //   const [formData, setFormData] = useState({
// // // //     name: "",
// // // //     email: "",
// // // //     password: "",
// // // //   });

// // // //   const from = route.params?.from || "Home";

// // // //   // Check if already logged in
// // // //   useEffect(() => {
// // // //     const checkAuth = async () => {
// // // //       const token = await AsyncStorage.getItem("token");
// // // //       if (token) {
// // // //         navigation.replace(from);
// // // //       }
// // // //     };
// // // //     checkAuth();
// // // //   }, [navigation, from]);

// // // //   // Configure Google Sign-In
// // // //   useEffect(() => {
// // // //     GoogleSignin.configure({
// // // //       webClientId: "1043684646784-d9igjhng2cfdp006ogsi0am1i3d4djh1.apps.googleusercontent.com", // Your Web Client ID
// // // //       offlineAccess: true,
// // // //     });
// // // //   }, []);

// // // //   const handleChange = (field, value) => {
// // // //     setFormData({ ...formData, [field]: value });
// // // //     if (error) setError("");
// // // //   };

// // // //   const handleAuthSuccess = async (data) => {
// // // //     try {
// // // //       await AsyncStorage.setItem("token", data.token);
// // // //       await AsyncStorage.setItem("user", JSON.stringify(data.user));

// // // //       Alert.alert("Success", "Welcome! Authentication successful.");
// // // //       navigation.replace(from);
// // // //     } catch (e) {
// // // //       console.error("Failed to save auth data", e);
// // // //     }
// // // //   };

// // // //   // Email/Password Login or Register
// // // //   const handleEmailSubmit = async () => {
// // // //     if (!formData.email || !formData.password) {
// // // //       setError("Email and password are required");
// // // //       return;
// // // //     }
// // // //     if (!isLogin && !formData.name) {
// // // //       setError("Full name is required");
// // // //       return;
// // // //     }
// // // //     if (formData.password.length < 8) {
// // // //       setError("Password must be at least 8 characters");
// // // //       return;
// // // //     }

// // // //     setLoading(true);
// // // //     setError("");

// // // //     try {
// // // //       const endpoint = isLogin ? "/login" : "/register";
// // // //       const deviceId = "rn-device-" + Math.random().toString(36).substring(7); // Improve this later

// // // //       const body = isLogin
// // // //         ? { email: formData.email, password: formData.password, deviceId }
// // // //         : { ...formData, deviceId };

// // // //       const res = await fetch(`${API_BASE}${endpoint}`, {
// // // //         method: "POST",
// // // //         headers: { "Content-Type": "application/json" },
// // // //         body: JSON.stringify(body),
// // // //       });

// // // //       const data = await res.json();

// // // //       if (!res.ok) throw new Error(data.message || "Authentication failed");

// // // //       handleAuthSuccess(data);
// // // //     } catch (err) {
// // // //       setError(err.message);
// // // //       Alert.alert("Error", err.message);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   // Google Sign In
// // // //   const handleGoogleSignIn = async () => {
// // // //     setLoading(true);
// // // //     setError("");

// // // //     try {
// // // //       await GoogleSignin.hasPlayServices();
// // // //       const userInfo = await GoogleSignin.signIn();
// // // //       const { idToken } = userInfo;

// // // //       if (!idToken) throw new Error("No ID token received");

// // // //       const res = await fetch(`${API_BASE}/auth/google`, {
// // // //         method: "POST",
// // // //         headers: { "Content-Type": "application/json" },
// // // //         body: JSON.stringify({
// // // //           credential: idToken,
// // // //           deviceId: "rn-device-google",
// // // //         }),
// // // //       });

// // // //       const data = await res.json();

// // // //       if (!res.ok) throw new Error(data.message || "Google login failed");

// // // //       handleAuthSuccess(data);
// // // //     } catch (error) {
// // // //       if (error.code === statusCodes.SIGN_IN_CANCELLED) {
// // // //         // User cancelled
// // // //       } else if (error.code === statusCodes.IN_PROGRESS) {
// // // //         // Operation in progress
// // // //       } else {
// // // //         setError(error.message || "Google sign-in failed");
// // // //         Alert.alert("Google Sign-in Failed", error.message || "Please try again");
// // // //       }
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <SafeAreaView className="flex-1 bg-[#0f0f0f]">
// // // //       <KeyboardAvoidingView
// // // //         behavior={Platform.OS === "ios" ? "padding" : "height"}
// // // //         className="flex-1"
// // // //       >
// // // //         <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
// // // //           <View className="flex-1 items-center justify-center p-6">
// // // //             <View className="w-full max-w-md bg-[#1a1a1a] rounded-3xl shadow-2xl border border-gray-800 overflow-hidden">
// // // //               {/* Header */}
// // // //               <View className="p-8 pb-4 items-center">
// // // //                 <Text className="text-4xl font-bold text-red-600">Bitzo</Text>
// // // //                 <Text className="text-gray-400 mt-2 text-center">
// // // //                   {isLogin ? "Sign in to continue" : "Create your account"}
// // // //                 </Text>
// // // //               </View>

// // // //               {/* Tabs */}
// // // //               <View className="flex-row border-b border-gray-800">
// // // //                 <TouchableOpacity
// // // //                   onPress={() => setIsLogin(true)}
// // // //                   className={`flex-1 py-4 ${isLogin ? "border-b-2 border-red-600" : ""}`}
// // // //                 >
// // // //                   <Text className={`text-center font-medium ${isLogin ? "text-white" : "text-gray-400"}`}>
// // // //                     Login
// // // //                   </Text>
// // // //                 </TouchableOpacity>
// // // //                 <TouchableOpacity
// // // //                   onPress={() => setIsLogin(false)}
// // // //                   className={`flex-1 py-4 ${!isLogin ? "border-b-2 border-red-600" : ""}`}
// // // //                 >
// // // //                   <Text className={`text-center font-medium ${!isLogin ? "text-white" : "text-gray-400"}`}>
// // // //                     Register
// // // //                   </Text>
// // // //                 </TouchableOpacity>
// // // //               </View>

// // // //               <View className="p-8 pt-6 space-y-5">
// // // //                 {error ? (
// // // //                   <View className="bg-red-950/50 border border-red-800 p-3 rounded-xl">
// // // //                     <Text className="text-red-300 text-sm">{error}</Text>
// // // //                   </View>
// // // //                 ) : null}

// // // //                 {/* Google Button */}
// // // //                 <GoogleSigninButton
// // // //                   size={GoogleSigninButton.Size.Wide}
// // // //                   color={GoogleSigninButton.Color.Dark}
// // // //                   onPress={handleGoogleSignIn}
// // // //                   disabled={loading}
// // // //                 />

// // // //                 {/* Divider */}
// // // //                 <View className="flex-row items-center my-2">
// // // //                   <View className="flex-1 h-[1px] bg-gray-700" />
// // // //                   <Text className="mx-4 text-gray-500 text-sm">or</Text>
// // // //                   <View className="flex-1 h-[1px] bg-gray-700" />
// // // //                 </View>

// // // //                 {/* Form Fields */}
// // // //                 <View className="space-y-5">
// // // //                   {!isLogin && (
// // // //                     <View className="relative">
// // // //                       <User size={20} color="#6b7280" style={{ position: "absolute", left: 16, top: 14 }} />
// // // //                       <TextInput
// // // //                         placeholder="Full Name"
// // // //                         value={formData.name}
// // // //                         onChangeText={(text) => handleChange("name", text)}
// // // //                         className="bg-[#121212] border border-gray-700 rounded-xl py-4 pl-12 pr-4 text-white"
// // // //                         placeholderTextColor="#6b7280"
// // // //                       />
// // // //                     </View>
// // // //                   )}

// // // //                   <View className="relative">
// // // //                     <Mail size={20} color="#6b7280" style={{ position: "absolute", left: 16, top: 14 }} />
// // // //                     <TextInput
// // // //                       placeholder="Email address"
// // // //                       value={formData.email}
// // // //                       onChangeText={(text) => handleChange("email", text)}
// // // //                       keyboardType="email-address"
// // // //                       autoCapitalize="none"
// // // //                       className="bg-[#121212] border border-gray-700 rounded-xl py-4 pl-12 pr-4 text-white"
// // // //                       placeholderTextColor="#6b7280"
// // // //                     />
// // // //                   </View>

// // // //                   <View className="relative">
// // // //                     <Lock size={20} color="#6b7280" style={{ position: "absolute", left: 16, top: 14 }} />
// // // //                     <TextInput
// // // //                       placeholder="Password"
// // // //                       value={formData.password}
// // // //                       onChangeText={(text) => handleChange("password", text)}
// // // //                       secureTextEntry={!showPassword}
// // // //                       className="bg-[#121212] border border-gray-700 rounded-xl py-4 pl-12 pr-12 text-white"
// // // //                       placeholderTextColor="#6b7280"
// // // //                     />
// // // //                     <TouchableOpacity
// // // //                       onPress={() => setShowPassword(!showPassword)}
// // // //                       style={{ position: "absolute", right: 16, top: 14 }}
// // // //                     >
// // // //                       {showPassword ? <EyeOff size={20} color="#9ca3af" /> : <Eye size={20} color="#9ca3af" />}
// // // //                     </TouchableOpacity>
// // // //                   </View>

// // // //                   <TouchableOpacity
// // // //                     onPress={handleEmailSubmit}
// // // //                     disabled={loading}
// // // //                     className={`py-4 rounded-xl flex-row items-center justify-center gap-2 mt-2 ${
// // // //                       loading ? "bg-gray-700" : "bg-red-600 active:bg-red-700"
// // // //                     }`}
// // // //                   >
// // // //                     {loading ? (
// // // //                       <ActivityIndicator color="white" />
// // // //                     ) : (
// // // //                       <>
// // // //                         <Text className="text-white font-medium text-base">
// // // //                           {isLogin ? "Sign In" : "Create Account"}
// // // //                         </Text>
// // // //                         <ArrowRight size={20} color="white" />
// // // //                       </>
// // // //                     )}
// // // //                   </TouchableOpacity>
// // // //                 </View>

// // // //                 {/* Switch between Login and Register */}
// // // //                 <View className="pt-4">
// // // //                   <Text className="text-center text-gray-500">
// // // //                     {isLogin ? "Don't have an account? " : "Already have an account? "}
// // // //                     <Text
// // // //                       onPress={() => setIsLogin(!isLogin)}
// // // //                       className="text-red-500 font-medium"
// // // //                     >
// // // //                       {isLogin ? "Sign up" : "Sign in"}
// // // //                     </Text>
// // // //                   </Text>
// // // //                 </View>
// // // //               </View>
// // // //             </View>
// // // //           </View>
// // // //         </ScrollView>
// // // //       </KeyboardAvoidingView>
// // // //     </SafeAreaView>
// // // //   );
// // // // }

// // // import React, { useState, useEffect } from "react";
// // // import {
// // //   View,
// // //   Text,
// // //   TextInput,
// // //   TouchableOpacity,
// // //   Alert,
// // //   ActivityIndicator,
// // //   SafeAreaView,
// // //   KeyboardAvoidingView,
// // //   Platform,
// // //   ScrollView,
// // // } from "react-native";
// // // import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react-native";
// // // import AsyncStorage from "@react-native-async-storage/async-storage";

// // // const API_BASE = "https://bitzo-server-1.onrender.com/api";

// // // export default function LoginScreen({ navigation, route }) {
// // //   const [isLogin, setIsLogin] = useState(true);
// // //   const [showPassword, setShowPassword] = useState(false);
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState("");
// // //   const [formData, setFormData] = useState({
// // //     name: "",
// // //     email: "",
// // //     password: "",
// // //   });

// // //   const from = route.params?.from || "Home";

// // //   // Check if user is already logged in
// // //   useEffect(() => {
// // //     const checkAuth = async () => {
// // //       const token = await AsyncStorage.getItem("token");
// // //       if (token) {
// // //         navigation.replace(from);
// // //       }
// // //     };
// // //     checkAuth();
// // //   }, [navigation, from]);

// // //   const handleChange = (field, value) => {
// // //     setFormData({ ...formData, [field]: value });
// // //     if (error) setError("");
// // //   };

// // //   const handleAuthSuccess = async (data) => {
// // //     try {
// // //       await AsyncStorage.setItem("token", data.token);
// // //       await AsyncStorage.setItem("user", JSON.stringify(data.user));

// // //       Alert.alert("Success", "Welcome! Authentication successful.");
// // //       navigation.replace(from);
// // //     } catch (e) {
// // //       console.error("Failed to save auth data", e);
// // //     }
// // //   };

// // //   // Handle Login / Register
// // //   const handleSubmit = async () => {
// // //     // Basic Validation
// // //     if (!formData.email || !formData.password) {
// // //       setError("Email and password are required");
// // //       return;
// // //     }
// // //     if (!isLogin && !formData.name) {
// // //       setError("Full name is required");
// // //       return;
// // //     }
// // //     if (formData.password.length < 8) {
// // //       setError("Password must be at least 8 characters");
// // //       return;
// // //     }

// // //     setLoading(true);
// // //     setError("");

// // //     try {
// // //       const endpoint = isLogin ? "/login" : "/register";
// // //       const deviceId = "rn-device-" + Math.random().toString(36).substring(7);

// // //       const body = isLogin
// // //         ? { email: formData.email, password: formData.password, deviceId }
// // //         : { ...formData, deviceId };

// // //       const res = await fetch(`${API_BASE}${endpoint}`, {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify(body),
// // //       });

// // //       const data = await res.json();

// // //       if (!res.ok) {
// // //         throw new Error(data.message || "Authentication failed");
// // //       }

// // //       handleAuthSuccess(data);
// // //     } catch (err) {
// // //       setError(err.message);
// // //       Alert.alert("Error", err.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <SafeAreaView className="flex-1 bg-[#0f0f0f]">
// // //       <KeyboardAvoidingView
// // //         behavior={Platform.OS === "ios" ? "padding" : "height"}
// // //         className="flex-1"
// // //       >
// // //         <ScrollView
// // //           contentContainerStyle={{ flexGrow: 1 }}
// // //           keyboardShouldPersistTaps="handled"
// // //         >
// // //           <View className="flex-1 items-center justify-center p-6">
// // //             <View className="w-full max-w-md bg-[#1a1a1a] rounded-3xl shadow-2xl border border-gray-800 overflow-hidden">

// // //               {/* Header */}
// // //               <View className="p-8 pb-4 items-center">
// // //                 <Text className="text-4xl font-bold text-red-600">Bitzo</Text>
// // //                 <Text className="text-gray-400 mt-2 text-center">
// // //                   {isLogin ? "Sign in to continue" : "Create your account"}
// // //                 </Text>
// // //               </View>

// // //               {/* Login / Register Tabs */}
// // //               <View className="flex-row border-b border-gray-800">
// // //                 <TouchableOpacity
// // //                   onPress={() => setIsLogin(true)}
// // //                   className={`flex-1 py-4 ${isLogin ? "border-b-2 border-red-600" : ""}`}
// // //                 >
// // //                   <Text className={`text-center font-medium ${isLogin ? "text-white" : "text-gray-400"}`}>
// // //                     Login
// // //                   </Text>
// // //                 </TouchableOpacity>
// // //                 <TouchableOpacity
// // //                   onPress={() => setIsLogin(false)}
// // //                   className={`flex-1 py-4 ${!isLogin ? "border-b-2 border-red-600" : ""}`}
// // //                 >
// // //                   <Text className={`text-center font-medium ${!isLogin ? "text-white" : "text-gray-400"}`}>
// // //                     Register
// // //                   </Text>
// // //                 </TouchableOpacity>
// // //               </View>

// // //               <View className="p-8 pt-6 space-y-5">
// // //                 {/* Error Message */}
// // //                 {error ? (
// // //                   <View className="bg-red-950/50 border border-red-800 p-3 rounded-xl">
// // //                     <Text className="text-red-300 text-sm">{error}</Text>
// // //                   </View>
// // //                 ) : null}

// // //                 {/* Form Fields */}
// // //                 <View className="space-y-5">
// // //                   {/* Name Field - Only for Register */}
// // //                   {!isLogin && (
// // //                     <View className="relative">
// // //                       <User size={20} color="#6b7280" style={{ position: "absolute", left: 16, top: 14 }} />
// // //                       <TextInput
// // //                         placeholder="Full Name"
// // //                         value={formData.name}
// // //                         onChangeText={(text) => handleChange("name", text)}
// // //                         className="bg-[#121212] border border-gray-700 rounded-xl py-4 pl-12 pr-4 text-white"
// // //                         placeholderTextColor="#6b7280"
// // //                       />
// // //                     </View>
// // //                   )}

// // //                   {/* Email Field */}
// // //                   <View className="relative">
// // //                     <Mail size={20} color="#6b7280" style={{ position: "absolute", left: 16, top: 14 }} />
// // //                     <TextInput
// // //                       placeholder="Email address"
// // //                       value={formData.email}
// // //                       onChangeText={(text) => handleChange("email", text)}
// // //                       keyboardType="email-address"
// // //                       autoCapitalize="none"
// // //                       className="bg-[#121212] border border-gray-700 rounded-xl py-4 pl-12 pr-4 text-white"
// // //                       placeholderTextColor="#6b7280"
// // //                     />
// // //                   </View>

// // //                   {/* Password Field */}
// // //                   <View className="relative">
// // //                     <Lock size={20} color="#6b7280" style={{ position: "absolute", left: 16, top: 14 }} />
// // //                     <TextInput
// // //                       placeholder="Password"
// // //                       value={formData.password}
// // //                       onChangeText={(text) => handleChange("password", text)}
// // //                       secureTextEntry={!showPassword}
// // //                       className="bg-[#121212] border border-gray-700 rounded-xl py-4 pl-12 pr-12 text-white"
// // //                       placeholderTextColor="#6b7280"
// // //                     />
// // //                     <TouchableOpacity
// // //                       onPress={() => setShowPassword(!showPassword)}
// // //                       style={{ position: "absolute", right: 16, top: 14 }}
// // //                     >
// // //                       {showPassword ? (
// // //                         <EyeOff size={20} color="#9ca3af" />
// // //                       ) : (
// // //                         <Eye size={20} color="#9ca3af" />
// // //                       )}
// // //                     </TouchableOpacity>
// // //                   </View>

// // //                   {/* Submit Button */}
// // //                   <TouchableOpacity
// // //                     onPress={handleSubmit}
// // //                     disabled={loading}
// // //                     className={`py-4 rounded-xl flex-row items-center justify-center gap-2 mt-2 ${
// // //                       loading ? "bg-gray-700" : "bg-red-600 active:bg-red-700"
// // //                     }`}
// // //                   >
// // //                     {loading ? (
// // //                       <ActivityIndicator color="white" />
// // //                     ) : (
// // //                       <>
// // //                         <Text className="text-white font-medium text-base">
// // //                           {isLogin ? "Sign In" : "Create Account"}
// // //                         </Text>
// // //                         <ArrowRight size={20} color="white" />
// // //                       </>
// // //                     )}
// // //                   </TouchableOpacity>
// // //                 </View>

// // //                 {/* Toggle Login/Register */}
// // //                 <View className="pt-4">
// // //                   <Text className="text-center text-gray-500">
// // //                     {isLogin ? "Don't have an account? " : "Already have an account? "}
// // //                     <Text
// // //                       onPress={() => setIsLogin(!isLogin)}
// // //                       className="text-red-500 font-medium"
// // //                     >
// // //                       {isLogin ? "Sign up" : "Sign in"}
// // //                     </Text>
// // //                   </Text>
// // //                 </View>
// // //               </View>
// // //             </View>
// // //           </View>
// // //         </ScrollView>
// // //       </KeyboardAvoidingView>
// // //     </SafeAreaView>
// // //   );
// // // }

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
// // } from "react-native";
// // import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react-native";
// // import AsyncStorage from "@react-native-async-storage/async-storage";

// // const API_BASE = "https://bitzo-server-1.onrender.com/api";

// // export default function AuthScreen({ navigation, route }) {
// //   const [isLogin, setIsLogin] = useState(true);
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");

// //   const [formData, setFormData] = useState({
// //     name: "",
// //     email: "",
// //     password: "",
// //   });

// //   const from = route.params?.from || "Home";

// //   // Check if already logged in
// //   useEffect(() => {
// //     const checkAuth = async () => {
// //       const token = await AsyncStorage.getItem("token");
// //       if (token) {
// //         navigation.replace(from);
// //       }
// //     };
// //     checkAuth();
// //   }, [navigation, from]);

// //   const handleChange = (field, value) => {
// //     setFormData({ ...formData, [field]: value });
// //     if (error) setError("");
// //   };

// //   const handleAuthSuccess = async (data) => {
// //     try {
// //       await AsyncStorage.setItem("token", data.token);
// //       await AsyncStorage.setItem("user", JSON.stringify(data.user));

// //       Alert.alert("Welcome!", "Authentication successful.");
// //       navigation.replace(from);
// //     } catch (e) {
// //       console.error("Failed to save auth data", e);
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
// //       setError(err.message);
// //       Alert.alert("Error", err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <SafeAreaView className="flex-1 bg-[#0f0f0f]">
// //       <KeyboardAvoidingView
// //         behavior={Platform.OS === "ios" ? "padding" : "height"}
// //         className="flex-1"
// //       >
// //         <ScrollView
// //           contentContainerStyle={{ flexGrow: 1 }}
// //           keyboardShouldPersistTaps="handled"
// //         >
// //           <View className="flex-1 items-center justify-center p-6">

// //             <View className="w-full max-w-md bg-[#1a1a1a] rounded-3xl shadow-2xl border border-gray-800 overflow-hidden">

// //               {/* Header */}
// //               <View className="p-8 pb-4 items-center">
// //                 <Text className="text-4xl font-bold text-red-600">Bitzo</Text>
// //                 <Text className="text-gray-400 mt-3 text-center text-lg">
// //                   {isLogin ? "Sign in to continue" : "Create your account"}
// //                 </Text>
// //               </View>

// //               {/* Tabs */}
// //               <View className="flex-row border-b border-gray-800">
// //                 <TouchableOpacity
// //                   onPress={() => setIsLogin(true)}
// //                   className={`flex-1 py-4 ${isLogin ? "border-b-2 border-red-600" : ""}`}
// //                 >
// //                   <Text className={`text-center font-semibold text-base ${isLogin ? "text-white" : "text-gray-400"}`}>
// //                     Login
// //                   </Text>
// //                 </TouchableOpacity>
// //                 <TouchableOpacity
// //                   onPress={() => setIsLogin(false)}
// //                   className={`flex-1 py-4 ${!isLogin ? "border-b-2 border-red-600" : ""}`}
// //                 >
// //                   <Text className={`text-center font-semibold text-base ${!isLogin ? "text-white" : "text-gray-400"}`}>
// //                     Register
// //                   </Text>
// //                 </TouchableOpacity>
// //               </View>

// //               <View className="p-8 pt-6 space-y-6">
// //                 {/* Error Message */}
// //                 {error ? (
// //                   <View className="bg-red-950/70 border border-red-800 p-4 rounded-2xl">
// //                     <Text className="text-red-300 text-sm text-center">{error}</Text>
// //                   </View>
// //                 ) : null}

// //                 {/* Form */}
// //                 <View className="space-y-5">
// //                   {/* Name Field - Show only in Register */}
// //                   {!isLogin && (
// //                     <View className="relative">
// //                       <User size={20} color="#6b7280" style={{ position: "absolute", left: 16, top: 16 }} />
// //                       <TextInput
// //                         placeholder="Full Name"
// //                         value={formData.name}
// //                         onChangeText={(text) => handleChange("name", text)}
// //                         className="bg-[#121212] border border-gray-700 rounded-2xl py-4 pl-12 pr-4 text-white text-base"
// //                         placeholderTextColor="#6b7280"
// //                       />
// //                     </View>
// //                   )}

// //                   {/* Email Field */}
// //                   <View className="relative">
// //                     <Mail size={20} color="#6b7280" style={{ position: "absolute", left: 16, top: 16 }} />
// //                     <TextInput
// //                       placeholder="Email address"
// //                       value={formData.email}
// //                       onChangeText={(text) => handleChange("email", text)}
// //                       keyboardType="email-address"
// //                       autoCapitalize="none"
// //                       className="bg-[#121212] border border-gray-700 rounded-2xl py-4 pl-12 pr-4 text-white text-base"
// //                       placeholderTextColor="#6b7280"
// //                     />
// //                   </View>

// //                   {/* Password Field */}
// //                   <View className="relative">
// //                     <Lock size={20} color="#6b7280" style={{ position: "absolute", left: 16, top: 16 }} />
// //                     <TextInput
// //                       placeholder="Password"
// //                       value={formData.password}
// //                       onChangeText={(text) => handleChange("password", text)}
// //                       secureTextEntry={!showPassword}
// //                       className="bg-[#121212] border border-gray-700 rounded-2xl py-4 pl-12 pr-12 text-white text-base"
// //                       placeholderTextColor="#6b7280"
// //                     />
// //                     <TouchableOpacity
// //                       onPress={() => setShowPassword(!showPassword)}
// //                       style={{ position: "absolute", right: 16, top: 16 }}
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
// //                     className={`py-4 rounded-2xl flex-row items-center justify-center gap-2 mt-2 ${
// //                       loading ? "bg-gray-700" : "bg-red-600 active:bg-red-700"
// //                     }`}
// //                   >
// //                     {loading ? (
// //                       <ActivityIndicator color="#fff" size="small" />
// //                     ) : (
// //                       <>
// //                         <Text className="text-white font-semibold text-lg">
// //                           {isLogin ? "Sign In" : "Create Account"}
// //                         </Text>
// //                         <ArrowRight size={22} color="white" />
// //                       </>
// //                     )}
// //                   </TouchableOpacity>
// //                 </View>

// //                 {/* Toggle Link */}
// //                 <View className="pt-2">
// //                   <Text className="text-center text-gray-400 text-base">
// //                     {isLogin ? "Don't have an account? " : "Already have an account? "}
// //                     <Text
// //                       onPress={() => setIsLogin(!isLogin)}
// //                       className="text-red-500 font-semibold"
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
// } from "react-native";
// import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const API_BASE = "https://bitzo-server-1.onrender.com/api";

// export default function AuthScreen({ navigation, route }) {
//   const [isLogin, setIsLogin] = useState(true);
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const from = route.params?.from || "AdminPanel";

//   // Check if already logged in
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const token = await AsyncStorage.getItem("token");
//         if (token) {
//           navigation.replace(from);        // ← yahan 'AdminPanel' ki jagah 'from' use kiya
//         }
//       } catch (e) {
//         console.log("Auth check error", e);
//       }
//     };
//     checkAuth();
//   }, [navigation, from]);

//   const handleChange = (field: string, value: string) => {
//     setFormData({ ...formData, [field]: value });
//     if (error) setError("");
//   };

//   const handleAuthSuccess = async (data: any) => {
//     try {
//       await AsyncStorage.setItem("token", data.token);
//       await AsyncStorage.setItem("user", JSON.stringify(data.user));

//       Alert.alert("Welcome!", "Authentication successful.");
//       navigation.replace(from);
//     } catch (e) {
//       console.error("Failed to save auth data", e);
//       Alert.alert("Success", "Login successful but failed to save data");
//     }
//   };

//   const handleSubmit = async () => {
//     // Validation
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
//     } catch (err: any) {
//       const errorMsg = err.message || "Something went wrong";
//       setError(errorMsg);
//       Alert.alert("Error", errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-[#0f0f0f]">
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         className="flex-1"
//       >
//         <ScrollView
//           contentContainerStyle={{ flexGrow: 1 }}
//           keyboardShouldPersistTaps="handled"
//         >
//           <View className="flex-1 items-center justify-center p-6 min-h-full">

//             <View className="w-full max-w-md bg-[#1a1a1a] rounded-3xl shadow-2xl border border-gray-800 overflow-hidden">

//               {/* Header */}
//               <View className="p-10 pb-5 items-center">
//                 <Text className="text-5xl font-bold text-red-600 tracking-tighter">Bitzo</Text>
//                 <Text className="text-gray-400 mt-3 text-center text-lg">
//                   {isLogin ? "Sign in to continue" : "Create your account"}
//                 </Text>
//               </View>

//               {/* Login / Register Tabs */}
//               <View className="flex-row border-b border-gray-800">
//                 <TouchableOpacity
//                   onPress={() => setIsLogin(true)}
//                   className={`flex-1 py-4 ${isLogin ? "border-b-2 border-red-600" : ""}`}
//                 >
//                   <Text className={`text-center font-semibold text-base ${isLogin ? "text-white" : "text-gray-400"}`}>
//                     Login
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() => setIsLogin(false)}
//                   className={`flex-1 py-4 ${!isLogin ? "border-b-2 border-red-600" : ""}`}
//                 >
//                   <Text className={`text-center font-semibold text-base ${!isLogin ? "text-white" : "text-gray-400"}`}>
//                     Register
//                   </Text>
//                 </TouchableOpacity>
//               </View>

//               <View className="p-8 pt-6 space-y-6">
//                 {/* Error Message */}
//                 {error ? (
//                   <View className="bg-red-950/70 border border-red-800 p-4 rounded-2xl">
//                     <Text className="text-red-300 text-sm text-center">{error}</Text>
//                   </View>
//                 ) : null}

//                 {/* Form */}
//                 <View className="space-y-5">
//                   {!isLogin && (
//                     <View className="relative">
//                       <User size={20} color="#6b7280" style={{ position: "absolute", left: 16, top: 16 }} />
//                       <TextInput
//                         placeholder="Full Name"
//                         value={formData.name}
//                         onChangeText={(text) => handleChange("name", text)}
//                         className="bg-[#121212] border border-gray-700 rounded-2xl py-4 pl-12 pr-4 text-white text-base"
//                         placeholderTextColor="#6b7280"
//                       />
//                     </View>
//                   )}

//                   <View className="relative">
//                     <Mail size={20} color="#6b7280" style={{ position: "absolute", left: 16, top: 16 }} />
//                     <TextInput
//                       placeholder="Email address"
//                       value={formData.email}
//                       onChangeText={(text) => handleChange("email", text)}
//                       keyboardType="email-address"
//                       autoCapitalize="none"
//                       className="bg-[#121212] border border-gray-700 rounded-2xl py-4 pl-12 pr-4 text-white text-base"
//                       placeholderTextColor="#6b7280"
//                     />
//                   </View>

//                   <View className="relative">
//                     <Lock size={20} color="#6b7280" style={{ position: "absolute", left: 16, top: 16 }} />
//                     <TextInput
//                       placeholder="Password"
//                       value={formData.password}
//                       onChangeText={(text) => handleChange("password", text)}
//                       secureTextEntry={!showPassword}
//                       className="bg-[#121212] border border-gray-700 rounded-2xl py-4 pl-12 pr-12 text-white text-base"
//                       placeholderTextColor="#6b7280"
//                     />
//                     <TouchableOpacity
//                       onPress={() => setShowPassword(!showPassword)}
//                       style={{ position: "absolute", right: 16, top: 16 }}
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
//                     className={`py-4 rounded-2xl flex-row items-center justify-center gap-2 mt-4 ${
//                       loading ? "bg-gray-700" : "bg-red-600 active:bg-red-700"
//                     }`}
//                   >
//                     {loading ? (
//                       <ActivityIndicator color="#fff" size="small" />
//                     ) : (
//                       <>
//                         <Text className="text-white font-semibold text-lg">
//                           {isLogin ? "Sign In" : "Create Account"}
//                         </Text>
//                         <ArrowRight size={22} color="white" />
//                       </>
//                     )}
//                   </TouchableOpacity>
//                 </View>

//                 {/* Toggle between Login & Register */}
//                 <View className="pt-4">
//                   <Text className="text-center text-gray-400 text-base">
//                     {isLogin ? "Don't have an account? " : "Already have an account? "}
//                     <Text
//                       onPress={() => setIsLogin(!isLogin)}
//                       className="text-red-500 font-semibold"
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

const API_BASE = "https://bitzo-server-1.onrender.com/api";

export default function LoginScreen({ navigation, route }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const from = route?.params?.from || "AdminPanel";

  // Check if already logged in
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem("token");
  //       if (token) {
  //         navigation.replace(from);
  //       }
  //     } catch (e) {
  //       console.log("Auth check error", e);
  //     }
  //   };
  //   checkAuth();
  // }, [navigation, from]);

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
                      <User size={20} color="#6b7280" style={styles.icon} />
                      <TextInput
                        placeholder="Full Name"
                        value={formData.name}
                        onChangeText={(text) => handleChange("name", text)}
                        style={styles.input}
                        placeholderTextColor="#6b7280"
                      />
                    </View>
                  )}

                  <View style={styles.inputWrapper}>
                    <Mail size={20} color="#6b7280" style={styles.icon} />
                    <TextInput
                      placeholder="Email address"
                      value={formData.email}
                      onChangeText={(text) => handleChange("email", text)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={styles.input}
                      placeholderTextColor="#6b7280"
                    />
                  </View>

                  <View style={styles.inputWrapper}>
                    <Lock size={20} color="#6b7280" style={styles.icon} />
                    <TextInput
                      placeholder="Password"
                      value={formData.password}
                      onChangeText={(text) => handleChange("password", text)}
                      secureTextEntry={!showPassword}
                      style={styles.input}
                      placeholderTextColor="#6b7280"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      {showPassword ? (
                        <EyeOff size={20} color="#9ca3af" />
                      ) : (
                        <Eye size={20} color="#9ca3af" />
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
    color: "#9ca3af",
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
    color: "#9ca3af",
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
    color: "#9ca3af",
    fontSize: 15,
  },
  toggleLink: {
    color: "#ef4444",
    fontWeight: "600",
  },
});
