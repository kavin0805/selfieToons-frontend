import React, { useState } from "react";
import logo from "../../assets/images/ic_launcher.png";
import { Form, Input, Space, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Link } from "react-router";
import axios from "axios";

const Login = () => {
  const [form] = Form.useForm();
  const [value, setValue] = useState("login");
  const [otpSent, setOtpSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const sendOTP = async (mobile) => {
    const param = {
      mobile: mobile,
    };
  
    console.log("📲 Sending OTP to:", mobile);
    setLoading(true);
  
    try {
      const response = await axios.post("https://selfietoons.com/api/auth/request-otp", param);
      console.log("✅ OTP sent successfully:", response.data.otp);
      setOtpSent(true);
      alert("✅ OTP sent successfully:", response.data.otp);

    } catch (error) {
      console.error("❌ Failed to send OTP:", error.status);
      if(error.status === 404){
        alert("Mobile number not Register");
        return;  
      }
      alert("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

const verifyOTP = async (mobile, otp) => {
  const payload = {
    mobile: mobile,
    otp: otp,
  };

  console.log("📩 Verifying OTP:", otp, "for mobile:", mobile);
  setLoading(true);

  try {
    const response = await axios.post("https://selfietoons.com/api/auth/verify-otp", payload);
    console.log("✅ OTP verification successful:", response.data);
    alert("OTP verified successfully!");

    // ✅ Clear all fields
    form.resetFields();

    // ✅ Reset OTP state (optional) 
    setOtpSent(false);
  } catch (error) {
    console.error("❌ OTP verification failed:", error);
    alert("Invalid OTP or verification failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const register = async (mobile, name, profilePhoto) => { 
    const profileFile = profilePhoto?.[0]?.originFileObj;  
    const formData = new FormData();
    formData.append("mobile", mobile);
    formData.append("name", name);
    if (profileFile) {
      formData.append("photo", profileFile); // must match backend key name
    }
  
    try {
      const response = await axios.post("https://selfietoons.com/api/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("✅ Registration successful:", response.data);
      alert("✅ Registration successful");
      // Clear form
      form.resetFields();
    } catch (error) {
      if (error.response?.status === 409) {
        // Show a more user-friendly message for conflict
        alert("A user with this mobile number already exists. Please login instead.");
      } else {
        console.error("❌ Registration failed:", error);
        alert("Something went wrong during registration. Please try again.");
      }
    }
  };
  
  

  const SubmitButton = ({ form, children, loading, otpSent }) => {
    const [submittable, setSubmittable] = React.useState(false);
    const values = Form.useWatch([], form);
  
    React.useEffect(() => {
      const validateForm = async () => {
        try {
          await form.validateFields({ validateOnly: true });
  
          if (otpSent) {
            const otp = form.getFieldValue("otp") || "";
            if (otp.length !== 6) {
              setSubmittable(false);
              return;
            }
          }
  
          setSubmittable(true);
        } catch {
          setSubmittable(false);
        }
      };
  
      validateForm();
    }, [form, values, otpSent]);
    return (
        <Button
          type="primary"
          htmlType="submit"
          disabled={!submittable}
          loading={loading}
        >
          {children}
        </Button>
      );
    };

  return (
    <div className="login">
      <div className="login-card">
        <div className="login-section1">
          <img src={logo} alt="logo" />
        </div>
        {value === "login" ? (
          <div className="login-section2">
            <h2 style={{ textAlign: "center", color: "#6250a4", margin: 5 }}>
              Login
            </h2>
            <Form
              form={form}
              name="validateOnly"
              layout="vertical"
              autoComplete="off"
              onFinish={(values) => {
                const { mobile, otp } = values;
                if (!otpSent) {
                  sendOTP(mobile);
                } else {
                  verifyOTP(mobile, otp);
                }
              }}
            >
              <Form.Item
                name="mobile"
                label="Mobile No"
                rules={[
                  {
                    required: true,
                    message: "Please enter your mobile number",
                  },
                  {
                    pattern: /^\d{10}$/,
                    message: "Mobile number must be exactly 10 digits",
                  },
                ]}
              >
                <Input
                  maxLength={10}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault(); // block non-numeric input
                    }
                  }}
                />
              </Form.Item>
              {otpSent && (
                <Form.Item
                  name="otp"
                  label="OTP"
                  rules={[{ required: true, message: "Please enter the OTP" }]}
                >
                  <Input.OTP formatter={(str) => str.toUpperCase()} />
                </Form.Item>
              )}
              {/* <Form.Item name="otp" label="OTP" rules={[{ required: true }]}>
                <Input.OTP formatter={(str) => str.toUpperCase()} />
              </Form.Item> */}
              <Form.Item>
                <Space style={{ display: "flex", justifyContent: "center" }}>
                  <SubmitButton form={form}>
                    {otpSent ? "Verify" : "Send OTP"}
                  </SubmitButton>
                </Space>
              </Form.Item>
            </Form>
          </div>
        ) : (
          <div className="login-section2">
            <h2 style={{ textAlign: "center", color: "#6250a4", margin: 5 }}>
              SignUp
            </h2>
            <Form
              form={form}
              name="validateOnly"
              layout="vertical"
              autoComplete="off"
              onFinish={(values) => {
                const { mobile, name , profilePhoto} = values;
                register(mobile , name , profilePhoto)
              }}
            >
              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item
                name="mobile"
                label="Mobile No"
                rules={[
                  {
                    required: true,
                    message: "Please enter your mobile number",
                  },
                  {
                    pattern: /^\d{10}$/,
                    message: "Mobile number must be exactly 10 digits",
                  },
                ]}
              >
                <Input
                  maxLength={10}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault(); // block non-numeric input
                    }
                  }}
                />
              </Form.Item>

              <Form.Item
                name="profilePhoto"
                label="Profile Photo"
                valuePropName="fileList"
                getValueFromEvent={(e) =>
                  Array.isArray(e) ? e : e && e.fileList
                }
                rules={[
                  { required: true, message: "Please upload a profile photo!" },
                ]}
              >
                <Upload
                  name="file"
                  listType="picture"
                  beforeUpload={() => false} // prevents automatic upload
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>

              <Form.Item>
                <Space style={{ display: "flex", justifyContent: "center" }}>
                  <SubmitButton form={form}>Submit</SubmitButton>
                </Space>
              </Form.Item>
            </Form>
          </div>
        )}
        <div className="login-section3">
          {value === "login" ? (
            <>
              You Don't have a account?{" "}
              <span
                onClick={() => {
                  setValue("");
                  form.resetFields();
                }}
              >
                Register Now.
              </span>
            </>
          ) : (
            <>
              You already have a account?{" "}
              <span
                onClick={() => {
                  setValue("login");
                  form.resetFields();
                  setOtpSent(false);
                }}
              >
                Login here.
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
