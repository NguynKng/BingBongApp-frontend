import { Table, Button, Tooltip } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { getBackendImgURL } from "../../../utils/helper";
import { Check, X } from "lucide-react";

export default function UserTable({ data, loading }) {
  const config = {
    dataSource: data.map((item, index) => ({
      key: item._id,
      no: index + 1,
      avatar: item.avatar,
      fullName: item.fullName,
      email: item.email,
      isVerified: item.isVerified,
      createdAt: new Date(item.createdAt).toLocaleDateString("en-GB"),
    })),
    columns: [
      {
        title: "ID",
        dataIndex: "no",
        key: "no",
        align: "center",
      },
      {
        title: "Account",
        key: "account",
        align: "left",
        render: (_, record) => (
          <div className="flex items-center gap-2">
            <img
              src={
                getBackendImgURL(record.avatar)
              }
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm">{record.fullName}</span>
          </div>
        ),
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        align: "center",
      },
      {
        title: "Created At",
        dataIndex: "createdAt",
        key: "createdAt",
        align: "center",
      },
      {
        title: "Verified",
        dataIndex: "isVerified",
        key: "isVerified",
        align: "center",
        render: (value) => (
          <div
            className="flex items-center justify-center rounded-full px-2 py-1 text-white text-sm w-8 h-8 mx-auto"
            style={{ backgroundColor: value ? "green" : "red" }}
          >
            {value ? <Check /> : <X />}
          </div>
        ),
      },
      {
        title: "Actions",
        key: "actions",
        align: "center",
        render: (_, record) => (
          <div className="flex justify-center gap-2">
            <Button
              size="small"
              type={record.block ? "default" : "primary"}
              danger={record.block ? false : true}
              onClick={() => console.log("Block/Unblock", record.key)}
            >
              {record.block ? "Unblock" : "Block"}
            </Button>
            <Button
              size="small"
              danger
              onClick={() => console.log("Delete", record.key)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
  };

  return (
    <Table
      {...config}
      pagination={{ pageSize: 10 }}
      bordered={true}
      scroll={{ x: "max-content" }}
      loading={loading}
    />
  );
}
