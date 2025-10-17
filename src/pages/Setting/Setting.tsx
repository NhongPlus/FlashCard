/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Button, Loader, Text, Container, Paper, Group, Avatar, FileButton, Stack, Alert } from "@mantine/core";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebase";
import useAuth from "@/utils/hooks/useAuth";
import { createUserDoc, updateUserDoc, type UserData } from "@/services/User/userService";
import { FormTextInput } from "@/components/Input/TextInput/TextInput";
import { SingleDate } from "@/components/Input/SelectDate/SingleDate";
import { useForm } from "@mantine/form";
import { Timestamp } from "firebase/firestore";
import { IconUpload, IconCheck, IconX } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import style from './Setting.module.css';

// Upload ảnh lên Cloudinary
const uploadToCloudinary = async (file: File): Promise<string> => {
  // TODO: Thay đổi các giá trị này theo account Cloudinary của bạn
  const CLOUD_NAME = 'dqbmshvjm'; // Thay bằng cloud name thực của bạn
  const UPLOAD_PRESET = 'flashcard_preset'; // Preset name đã tạo

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  // Không cần append folder vì đã set trong preset

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary error:', errorData);
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Không thể upload ảnh');
  }
};

function SettingAccount() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setProfile(snap.data() as UserData);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <Container size="md" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Loader size="lg" />
      </Container>
    );
  }

  return (
    <div style={{ backgroundColor: "#F6F7FB", paddingBottom: 60 }}>
      <Container size="md">
        <Text className={style.headerText}>Cài đặt</Text>
        {profile ? (
          <EditProfileForm profile={profile} userId={user?.uid || ''} />
        ) : (
          <CreateProfileForm user={user} />
        )}
      </Container>
    </div>
  );
}

export default SettingAccount;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CreateProfileForm({ user }: { user: any }) {
  const [uploading, setUploading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const navigate = useNavigate();

  const form = useForm<{
    displayName: string;
    dob: Date | null;
    imageFile: File | null;
    imagePreview: string;
  }>({
    initialValues: {
      displayName: "",
      dob: null,
      imageFile: null,
      imagePreview: "",
    },
    validate: {
      displayName: (value) => (!value?.trim() ? "Tên không được để trống" : null),
      dob: (value) => (!value ? "Vui lòng chọn ngày sinh" : null),
    },
  });

  const handleFileSelect = (file: File | null) => {
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Vui lòng chọn file ảnh' });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Kích thước ảnh không được vượt quá 5MB' });
        return;
      }

      form.setFieldValue('imageFile', file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        form.setFieldValue('imagePreview', e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setMessage(null);
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    setSubmitLoading(true);
    setMessage(null);

    try {
      let imageUrl = "";

      // Upload ảnh nếu có
      if (values.imageFile) {
        setUploading(true);
        try {
          imageUrl = await uploadToCloudinary(values.imageFile);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          setMessage({ type: 'error', text: 'Không thể upload ảnh. Vui lòng thử lại.' });
          return;
        } finally {
          setUploading(false);
        }
      }

      // Tạo profile - Fix lỗi Timestamp với validation
      let dobTimestamp = null;
      if (values.dob) {
        try {
          // Đảm bảo values.dob là Date object trước khi tạo Timestamp
          if (values.dob instanceof Date) {
            dobTimestamp = Timestamp.fromDate(values.dob);
          } else if (typeof values.dob === 'string') {
            // Nếu là string, convert thành Date
            const dateObj = new Date(values.dob);
            if (!isNaN(dateObj.getTime())) {
              dobTimestamp = Timestamp.fromDate(dateObj);
            }
          } else if (values.dob && typeof values.dob === 'object' && 'getTime' in values.dob) {
            // Nếu có getTime method thì là Date-like object
            dobTimestamp = Timestamp.fromDate(values.dob as Date);
          }
        } catch (error) {
          console.error('Error converting date to Timestamp:', error);
          setMessage({ type: 'error', text: 'Lỗi xử lý ngày sinh. Vui lòng chọn lại.' });
          return;
        }
      }

      await createUserDoc(user.uid, {
        displayName: values.displayName.trim(),
        email: user.email || "",
        dob: dobTimestamp,
        role: "user",
        imageActive: imageUrl,
        images: imageUrl ? [imageUrl] : [],
      });

      setMessage({ type: 'success', text: 'Tạo profile thành công!' });

      // Navigate về dashboard sau 1.5s
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      console.error('Error creating profile:', error);
      setMessage({ type: 'error', text: 'Có lỗi xảy ra. Vui lòng thử lại.' });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Paper shadow="xs" p="xl">
      <Text size="lg" fw={600} mb="md">Tạo thông tin cá nhân</Text>

      {message && (
        <Alert
          icon={message.type === 'success' ? <IconCheck size={16} /> : <IconX size={16} />}
          color={message.type === 'success' ? 'green' : 'red'}
          mb="md"
        >
          {message.text}
        </Alert>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {/* Ảnh đại diện */}
          <div>
            <Text size="sm" fw={500} mb={8}>Ảnh đại diện</Text>
            <Group gap="md" align="center">
              <Avatar
                src={form.values.imagePreview}
                size={80}
                radius="md"
                alt="Avatar preview"
              />
              <FileButton
                onChange={handleFileSelect}
                accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                disabled={uploading || submitLoading}
              >
                {(props) => (
                  <Button
                    {...props}
                    leftSection={<IconUpload size={16} />}
                    variant="outline"
                    loading={uploading}
                  >
                    {uploading ? 'Đang upload...' : 'Chọn ảnh'}
                  </Button>
                )}
              </FileButton>
            </Group>
            <Text size="xs" c="gray" mt={4}>
              Hỗ trợ: PNG, JPG, JPEG, GIF, WebP. Tối đa 5MB.
            </Text>
          </div>

          {/* Tên */}
          <FormTextInput
            filled={false}
            label="Tên hiển thị"
            placeholder="Nhập tên của bạn"
            {...form.getInputProps("displayName")} />

          {/* Ngày sinh */}
          <SingleDate
            label="Ngày sinh"
            placeholder="Chọn ngày sinh"
            value={form.values.dob}
            onChange={(date) => form.setFieldValue("dob", date as Date | null)}
            error={form.errors.dob as string}
          />

          {/* Submit button */}
          <Button
            type="submit"
            size="md"
            loading={submitLoading || uploading}
            disabled={uploading}
          >
            {submitLoading ? 'Đang tạo...' : 'Tạo profile'}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}

function EditProfileForm({ profile, userId }: { profile: UserData; userId: string }) {
  const [uploading, setUploading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>(profile.imageActive || "");
  const navigate = useNavigate();

  // Convert Timestamp to Date for form - Fix lỗi getTime
  let profileDob: Date | null = null;
  if (profile.dob) {
    try {
      // Kiểm tra nếu có method toDate (Timestamp)
      if (profile.dob && typeof profile.dob === 'object' && 'toDate' in profile.dob) {
        profileDob = (profile.dob as Timestamp).toDate();
      }
      // Kiểm tra nếu là Date object
      else if (profile.dob && typeof profile.dob === 'object' && 'getTime' in profile.dob) {
        profileDob = profile.dob as Date;
      }
    } catch (error) {
      console.error('Error converting date:', error);
      profileDob = null;
    }
  }

  const form = useForm<{
    displayName: string;
    dob: Date | null;
    imageFile: File | null;
    imagePreview: string;
  }>({
    initialValues: {
      displayName: profile.displayName || "",
      dob: profileDob,
      imageFile: null,
      imagePreview: selectedImageUrl,
    },
    validate: {
      displayName: (value) => (!value?.trim() ? "Tên không được để trống" : null),
      dob: (value) => (!value ? "Vui lòng chọn ngày sinh" : null),
    },
  });

  const handleFileSelect = (file: File | null) => {
    if (file) {
      // Validate file
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Vui lòng chọn file ảnh' });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Kích thước ảnh không được vượt quá 5MB' });
        return;
      }

      form.setFieldValue('imageFile', file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPreview = e.target?.result as string;
        form.setFieldValue('imagePreview', newPreview);
        setSelectedImageUrl(""); // Reset selected từ gallery
      };
      reader.readAsDataURL(file);
      setMessage(null);
    }
  };

  const handleSelectExistingImage = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    form.setFieldValue('imagePreview', imageUrl);
    form.setFieldValue('imageFile', null); // Reset file upload
    setMessage(null);
  };

  const handleSubmit = async (values: typeof form.values) => {
    setSubmitLoading(true);
    setMessage(null);

    try {
      let imageUrl = profile.imageActive || "";

      // Nếu chọn ảnh từ gallery
      if (selectedImageUrl && !values.imageFile) {
        imageUrl = selectedImageUrl;
      }
      // Nếu upload ảnh mới
      else if (values.imageFile) {
        setUploading(true);
        try {
          imageUrl = await uploadToCloudinary(values.imageFile);
        } catch (error) {
          setMessage({ type: 'error', text: 'Không thể upload ảnh. Vui lòng thử lại.' });
          return;
        } finally {
          setUploading(false);
        }
      }

      // Update profile - Fix lỗi Timestamp với validation
      let dobTimestamp = null;
      if (values.dob) {
        try {
          // Đảm bảo values.dob là Date object trước khi tạo Timestamp
          if (values.dob instanceof Date) {
            dobTimestamp = Timestamp.fromDate(values.dob);
          } else if (typeof values.dob === 'string') {
            // Nếu là string, convert thành Date
            const dateObj = new Date(values.dob);
            if (!isNaN(dateObj.getTime())) {
              dobTimestamp = Timestamp.fromDate(dateObj);
            }
          } else if (values.dob && typeof values.dob === 'object' && 'getTime' in values.dob) {
            // Nếu có getTime method thì là Date-like object
            dobTimestamp = Timestamp.fromDate(values.dob as Date);
          }
        } catch (error) {
          console.error('Error converting date to Timestamp:', error);
          setMessage({ type: 'error', text: 'Lỗi xử lý ngày sinh. Vui lòng chọn lại.' });
          return;
        }
      }

      const updatedData: Partial<UserData> = {
        displayName: values.displayName.trim(),
        dob: dobTimestamp,
        imageActive: imageUrl, // Cập nhật imageActive
      };

      // Nếu upload ảnh mới, thêm vào mảng images
      if (values.imageFile && imageUrl && !profile.images?.includes(imageUrl)) {
        updatedData.images = [...(profile.images || []), imageUrl];
      }

      await updateUserDoc(userId, updatedData);

      setMessage({ type: 'success', text: 'Cập nhật profile thành công!' });

      // Navigate về dashboard sau 1.5s
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Có lỗi xảy ra. Vui lòng thử lại.' });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Paper shadow="xs" p="xl">
      <Text size="lg" fw={600} mb="md">Chỉnh sửa thông tin cá nhân</Text>

      {message && (
        <Alert
          icon={message.type === 'success' ? <IconCheck size={16} /> : <IconX size={16} />}
          color={message.type === 'success' ? 'green' : 'red'}
          mb="md"
        >
          {message.text}
        </Alert>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {/* Ảnh đại diện hiện tại */}
          <div>
            <Text size="sm" fw={500} mb={8}>Ảnh đại diện hiện tại</Text>
            <Group gap="md" align="center">
              <Avatar
                src={form.values.imagePreview}
                size={80}
                radius="md"
                alt="Current avatar"
              />
              <div>
                <FileButton
                  onChange={handleFileSelect}
                  accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                  disabled={uploading || submitLoading}
                >
                  {(props) => (
                    <Button
                      {...props}
                      leftSection={<IconUpload size={16} />}
                      variant="outline"
                      size="sm"
                      loading={uploading}
                    >
                      {uploading ? 'Đang upload...' : 'Upload ảnh mới'}
                    </Button>
                  )}
                </FileButton>
                <Text size="xs" c="gray" mt={4}>
                  Hỗ trợ: PNG, JPG, JPEG, GIF, WebP. Tối đa 5MB.
                </Text>
              </div>
            </Group>
          </div>

          {/* Gallery ảnh đã upload */}
          {profile.images && profile.images.length > 0 && (
            <div>
              <Text size="sm" fw={500} mb={8}>
                Hoặc chọn từ ảnh đã upload ({profile.images.length} ảnh)
              </Text>
              <Group gap="sm">
                {profile.images.map((imageUrl, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectExistingImage(imageUrl)}
                    style={{
                      cursor: 'pointer',
                      border: selectedImageUrl === imageUrl ? '3px solid #4c6ef5' : '2px solid transparent',
                      borderRadius: '80px',
                      padding: '2px',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <Avatar
                      src={imageUrl}
                      size={64}
                      radius="xl"
                      alt={`Uploaded image ${index + 1}`}
                    />
                  </div>
                ))}
              </Group>
              <Text size="xs" c="gray" mt={4}>
                Click vào ảnh để chọn làm ảnh đại diện
              </Text>
            </div>
          )}

          {/* Tên */}
          <FormTextInput
            filled={false} 
            label="Tên hiển thị"
            placeholder="Nhập tên của bạn"
            {...form.getInputProps("displayName")}          />

          {/* Ngày sinh */}
          <SingleDate
            label="Ngày sinh"
            placeholder="Chọn ngày sinh"
            value={form.values.dob}
            onChange={(date) => form.setFieldValue("dob", date as Date | null)}
            error={form.errors.dob as string}
          />

          {/* Email (readonly) */}
          <FormTextInput
            label="Email"
            value={profile.email}
            disabled
            description="Email không thể thay đổi"
          />

          {/* Submit button */}
          <Button
            type="submit"
            size="md"
            loading={submitLoading || uploading}
            disabled={uploading}
          >
            {submitLoading ? 'Đang cập nhật...' : 'Cập nhật profile'}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}