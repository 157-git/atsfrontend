import React from "react";
import { Modal, Form, Select, Input, Radio, DatePicker, TimePicker } from "antd";
import { PhoneOutlined, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, CommentOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const InterviewActionModal = ({ open, onClose, interviewFormData, setInterviewFormData, handleAntdFormChange, handleSubmit }) => {


  return (
    <Modal 
      title="Perform Action" 
      open={open} 
      onOk={handleSubmit} 
      onCancel={onClose}
    >
      <div className="infoMainDivMo">
        <Form labelCol={{ span: 10 }} labelAlign="left" wrapperCol={{ span: 20 }} layout="horizontal">
          
          {/* Calling Remark */}
          <Form.Item label="Calling Remark">
            <Select
              name="callingRemark"
              value={interviewFormData.callingRemark}
              onChange={(value) => handleAntdFormChange(value, "callingRemark")}
              prefix={<PhoneOutlined />}
            >
              {["Call Done", "Asked for Call Back", "No Answer", "Network Issue", "Invalid Number", "Need to call back", "Do not call again", "others"].map((option) => (
                <Select.Option key={option} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Interview Attending Status */}
          <Form.Item label="Interview Attending Status">
            <Radio.Group
              name="attendingStatus"
              value={interviewFormData.attendingStatus}
              onChange={(e) => handleAntdFormChange(e.target.value, "attendingStatus")}
              className="newclassformakeflexandjustifyformodal"
            >
              <Radio value="Yes">
                Yes <CheckCircleOutlined style={{ color: "green", marginRight: 5 }} />
              </Radio>
              <Radio value="No">
                No <CloseCircleOutlined style={{ color: "red", marginRight: 5 }} />
              </Radio>
              <Radio value="Not Confirm">
                Not Confirm <ExclamationCircleOutlined style={{ color: "red", marginRight: 5 }} />
              </Radio>
            </Radio.Group>
          </Form.Item>

          {/* Comment Field */}
          <Form.Item label="Comment">
            <Input
              placeholder="Enter Comment..."
              name="comment"
              value={interviewFormData.comment}
              onChange={(e) => handleAntdFormChange(e.target.value, "comment")}
              prefix={<CommentOutlined />}
            />
          </Form.Item>

          {/* Interview Date & Time (Only when 'Interview Attending Status' is 'No') */}
          {interviewFormData.attendingStatus === "No" && (
            <Form.Item label="Next Interview Date">
              <div className="wrappedForDisplayFle">
                <DatePicker
                  name="nextDate"
                  style={{ marginRight: "10px" }}
                  format="YYYY-MM-DD"
                  value={interviewFormData.nextDate ? dayjs(interviewFormData.nextDate) : null}
                  onChange={(date) => handleAntdFormChange(date ? dayjs(date).format("YYYY-MM-DD") : "", "nextDate")}
                />
                <TimePicker
                  name="nextTime"
                  format="hh:mm A"
                  value={interviewFormData.nextTime ? dayjs(interviewFormData.nextTime, "hh:mm A") : null}
                  onChange={(time) => handleAntdFormChange(time ? dayjs(time).format("hh:mm A") : "", "nextTime")}
                />
              </div>
            </Form.Item>
          )}
        </Form>
      </div>
    </Modal>
  );
};

export default InterviewActionModal;
