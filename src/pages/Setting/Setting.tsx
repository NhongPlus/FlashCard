import { useEffect, useState } from "react";
import { Button, Loader, Text, Container, Paper, TextInput } from "@mantine/core";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase"; // config firebase
import useAuth from "@/utils/hooks/useAuth";
import { createUserDoc, type UserData } from "@/services/userService";
import { FormTextInput } from "@/components/Input/TextInput/TextInput";
import { SingleDate } from "@/components/Input/SelectDate/SingleDate";
import { useForm } from "@mantine/form";
import { Timestamp } from "firebase/firestore";
import style from './Setting.module.css'
function SettingAcount() {
  const { user } = useAuth(); // user.uid, user.email
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setProfile(snap.data()); // đã có thông tin
      } else {
        setProfile(null); // chưa có thông tin
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  if (loading) return <Loader />;

  return (
    <div>
      {profile ? (
        <EditProfileForm profile={profile} />
      ) : (
        <CreateProfileForm user={user} />
      )}
    </div>
  );
}
export default SettingAcount

function CreateProfileForm({ user }: { user: any }) {
  const form = useForm<UserData>({
    initialValues: {
      displayName: "",
      dob: null as Date | null,
      email: "",
      role: "user",
    },
    validate: {
      displayName: (v) => (!v ? "Tên không được để trống" : null),
      dob: (v) => (!v ? "Chọn ngày sinh" : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    const dobTimestamp = values.dob ? Timestamp.fromDate(values.dob) : null;

    await createUserDoc(user.uid, {
      displayName: values.displayName,
      email: user.email, // lấy từ firebase
      dob: dobTimestamp,
      role: "user",
      images: [], // mặc định rỗng
      imageActive: "", // mặc định chưa có ảnh
    });
  };

  return (
    <div style={{ backgroundColor: "#F6F7FB" }}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Container size={"md"}>
          <Text className={style.headerText}>Cài đặt</Text>
          <Paper shadow="xs" p="xl">
            <FormTextInput
              label="Tên"
              placeholder="Nhập tên"
              {...form.getInputProps("displayName")}
            />
            <SingleDate
              label="Ngày sinh"
              value={form.values.dob}
              onChange={(d) => form.setFieldValue("dob", d)}
            />

            <Button type="submit" mt="md">
              Lưu
            </Button>
          </Paper>
        </Container>
      </form>
    </div>
  );
}

function EditProfileForm({ profile }: { profile: any }) {
  const [name, setName] = useState(profile.name);
  const [dob, setDob] = useState(profile.dob);

  const handleSubmit = async () => {
    await updateDoc(doc(db, "users", profile.uid), { name, dob });
    alert("Profile updated!");
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <TextInput label="Tên" value={name} onChange={(e) => setName(e.currentTarget.value)} />
      <TextInput label="Ngày sinh" value={dob} onChange={(e) => setDob(e.currentTarget.value)} />
      <Button type="submit">Cập nhật</Button>
    </form>
  );
}


