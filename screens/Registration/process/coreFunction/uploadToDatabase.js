import { supabase } from "../../../../utils/supabase";
import { File } from "expo-file-system";

/* ============================
   CHECK EXISTING USER
============================ */
export const checkExistingUser = async (accountId, email, setAccountId) => {
  try {
    // Check if account_id exists
    const { data: existingAccount } = await supabase
      .from("residents")
      .select("account_id")
      .eq("account_id", accountId)
      .single();

    if (existingAccount) {
      const newAccountId = Math.floor(100000 + Math.random() * 900000).toString();
      setAccountId(newAccountId);
      console.log("🔄 Account ID exists, generated new:", newAccountId);
    }

    // Check if email exists
    const { data: existingEmail } = await supabase
      .from("residents")
      .select("email")
      .eq("email", email)
      .single();

    if (existingEmail) {
      return { exists: true, type: "email" };
    }

    return { exists: false };
  } catch (error) {
    console.log("✅ User check passed (no duplicates)");
    return { exists: false };
  }
};

/* ============================
   UPLOAD CAMERA IMAGE (SECURED)
============================ */
export const uploadCameraImage = async (imageUri, folder, type, accountId) => {
  if (!imageUri) return null;

  try {
    // Unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 9);
    const fileName = `${folder}/${accountId}_${type}_${timestamp}_${randomString}.jpg`;

    console.log(`📸 Uploading ${type} ID: ${fileName}`);

    // ✅ NEW SDK 54 API: Use File class instead of readAsStringAsync
    const file = new File(imageUri);
    const base64 = await file.base64();
    
    // Convert base64 to Uint8Array
    const uint8Array = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

    // Upload to Supabase Storage (authenticated upload)
    const { error } = await supabase.storage
      .from("user-ids")
      .upload(fileName, uint8Array, {
        cacheControl: "3600",
        upsert: true,
        contentType: "image/jpeg",
      });

    if (error) {
      console.error(`❌ Upload failed (${type}):`, error.message);
      throw new Error(`Failed to upload ${type} ID: ${error.message}`);
    }

    // ✅ Return the file path instead of public URL
    // We'll generate signed URLs when needed
    console.log(`✅ ${type} ID uploaded:`, fileName);
    return fileName; // Return path, not public URL
  } catch (err) {
    console.error(`💥 Upload exception (${type}):`, err);
    throw err;
  }
};

/* ============================
   GET SIGNED URL FOR FILE
============================ */
export const getSignedUrl = async (filePath, expiresIn = 3600) => {
  try {
    if (!filePath) return null;

    const { data, error } = await supabase.storage
      .from("user-ids")
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      console.error("❌ Failed to get signed URL:", error);
      return null;
    }

    return data.signedUrl;
  } catch (err) {
    console.error("💥 Signed URL exception:", err);
    return null;
  }
};

/* ============================
   CLEANUP FILES
============================ */
export const cleanupUploadedFiles = async (frontIdPath, backIdPath) => {
  try {
    const filesToRemove = [];

    if (frontIdPath) {
      filesToRemove.push(frontIdPath);
    }

    if (backIdPath) {
      filesToRemove.push(backIdPath);
    }

    if (filesToRemove.length > 0) {
      await supabase.storage.from("user-ids").remove(filesToRemove);
      console.log("🧹 Cleaned up files:", filesToRemove);
    }
  } catch (err) {
    console.error("❌ File cleanup failed:", err.message);
  }
};

/* ============================
   CREATE AUTH USER
============================ */
export const createUserAccount = async (email, password, userMetadata) => {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: userMetadata },
  });

  if (authError) {
    console.error("❌ Auth error:", authError);

    let errorMessage = "Failed to create account. Please try again.";
    if (authError.message.includes("already registered")) {
      errorMessage = "This email is already registered. Try logging in.";
    } else if (authError.message.includes("Invalid email")) {
      errorMessage = "Please enter a valid email address.";
    } else if (authError.message.includes("Password")) {
      errorMessage = "Password must be at least 6 characters.";
    }

    throw new Error(errorMessage);
  }

  console.log("✅ Auth user created:", authData.user?.id);
  return authData;
};

/* ============================
   CREATE PROFILE
============================ */
export const createUserProfile = async (userProfileData) => {
  console.log("📝 Creating profile:", {
    ...userProfileData,
    front_id_url: userProfileData.front_id_url ? "uploaded" : "missing",
    back_id_url: userProfileData.back_id_url ? "uploaded" : "missing",
  });

  const { data, error } = await supabase
    .from("residents")
    .insert([userProfileData])
    .select()
    .single();

  if (error) {
    console.error("❌ Profile error:", error);

    let errorMsg = "Profile setup failed. Please try again.";
    if (error.code === "23505") {
      if (error.message.includes("account_id")) {
        errorMsg = "Account ID already exists. Try again.";
      } else if (error.message.includes("email")) {
        errorMsg = "Email already registered. Use another one.";
      }
    }

    throw new Error(errorMsg);
  }

  console.log("✅ Profile created:", data);
  return data;
};

/* ============================
   MAIN REGISTRATION PROCESS
============================ */
export const handleRegistrationProcess = async (userData, setLoadingMessage) => {
  const {
    accountId,
    setAccountId,
    email,
    password,
    frontId,
    backId,
    firstName,
    middleInitial,
    lastName,
    birthDate,
    calculateAge,
    contactNumber,
    blockNumber,
    lotNumber,
    phaseNumber,
    selectedId,
  } = userData;

  try {
    // Step 0: Check existing
    setLoadingMessage("Checking user data...");
    const userCheck = await checkExistingUser(accountId, email, setAccountId);
    if (userCheck.exists && userCheck.type === "email") {
      throw new Error("This email is already registered. Please log in.");
    }

    // Step 1: Create Auth account FIRST (needed for authenticated upload)
    setLoadingMessage("Creating account...");
    const authData = await createUserAccount(email, password, {
      account_id: accountId,
      first_name: firstName,
      middle_initial: middleInitial,
      last_name: lastName,
      full_name: `${firstName} ${middleInitial ? middleInitial + "." : ""} ${lastName}`.trim(),
    });

    // Step 2: Upload ID photos (now authenticated)
    setLoadingMessage("Uploading ID photos...");
    let frontIdPath, backIdPath;
    try {
      [frontIdPath, backIdPath] = await Promise.all([
        uploadCameraImage(frontId, "government-ids", "front", accountId),
        uploadCameraImage(backId, "government-ids", "back", accountId),
      ]);

      console.log("✅ Both ID images uploaded");
    } catch (uploadError) {
      // If upload fails, clean up auth account
      await supabase.auth.signOut();
      throw uploadError;
    }

    // Step 3: Create user profile
    setLoadingMessage("Setting up profile...");
    try {
      const profileData = await createUserProfile({
        auth_user_id: authData.user.id,
        account_id: accountId,
        first_name: firstName,
        middle_initial: middleInitial || null,
        last_name: lastName,
        birth_date: birthDate?.toISOString().split("T")[0],
        age: calculateAge(birthDate),
        contact_number: contactNumber,
        block_number: blockNumber,
        lot_number: lotNumber,
        phase_number: phaseNumber,
        id_type: selectedId,
        email,
        front_id_url: frontIdPath, // Store file path, not URL
        back_id_url: backIdPath,   // Store file path, not URL
      });

      return { success: true, accountId, profileData };
    } catch (profileError) {
      await supabase.auth.signOut();
      await cleanupUploadedFiles(frontIdPath, backIdPath);
      throw profileError;
    }
  } catch (error) {
    console.error("💥 Registration failed:", error);
    await supabase.auth.signOut();
    throw error;
  }
};