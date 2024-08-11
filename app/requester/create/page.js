"use client";
import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Textarea,
  Image,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaInfoCircle } from "react-icons/fa";

export default function RequesterForm() {
  const [user, setUser] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [lastDate, setLastDate] = useState("");
  const [address, setAddress] = useState("");
  const [specialNote, setSpecialNote] = useState("");
  const router = useRouter();

  useEffect(() => {
    const profile = async () => {
      const { data } = await axios.get("/api/users/myprofile");
      setUser(data.user._id);
    };
    profile();
   
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      needer:user,
      productName,
      quantity,
      lastDate,
      address,
      specialNote,
    };

    try {
      const response = await axios.post("/api/requests/new", formData);

      if (!response.data.success) {
        throw new Error("Failed to create request");
      }

      alert("Request created successfully");
      router.push("/requests/success");
    } catch (error) {
      console.error("Error:", error);
      alert("Submission failed");
    }
  };

  return (
    <div className="flex justify-center align-middle">
      <Card className="card">
        <CardHeader className="flex gap-3">
          <Image
            alt="nextui logo"
            height={40}
            radius="sm"
            src="https://utfs.io/f/a9b8f892-fc28-48d6-be0a-3a22f2dc0d06-d48s3m.png"
            width={40}
          />
          <div className="flex flex-col">
            <p className="text-md">PARKWIZ</p>
            <p className="text-small text-default-500">Requester Form</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="m-10">
          <form
            className="flex flex-col align-middle gap-3 p-10"
            onSubmit={handleSubmit}
          >

            <Input
              isClearable
              isRequired
              label="Product Name"
              variant="bordered"
              description="Enter the product name."
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="max-w-xs"
            />
            <Input
              type="number"
              isRequired
              label="Quantity"
              variant="bordered"
              value={quantity}
              min={1}
              onChange={(e) => setQuantity(e.target.value)}
              className="max-w-xs"
            />
            <Input
              type="date"
              isRequired
              label="Last Date for Requirement"
              variant="bordered"
              value={lastDate}
              onChange={(e) => setLastDate(e.target.value)}
              className="max-w-xs"
            />
            <Input
              isClearable
              isRequired
              label="Address"
              variant="bordered"
              description="Enter the address."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="max-w-xs"
            />
            <Textarea
              label="Special Note"
              placeholder="Any special notes?"
              variant="bordered"
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              className="max-w-xs"
            />
            {/* <RadioGroup
              label="Status"
              value={status}
              onValueChange={setStatus}
              className="max-w-xs"
            >
              <Radio value="pending">Pending</Radio>
              <Radio value="approved">Approved</Radio>
              <Radio value="completed">Completed</Radio>
            </RadioGroup> */}
            <Button color="primary" type="submit">
              Submit Request
            </Button>
          </form>
        </CardBody>
        <Divider />
        <CardFooter>
          <p>
            Need help? <FaInfoCircle className="inline-block ml-1" />
          </p>
          <span>
            <Link
              className="text-blue-600"
              showAnchorIcon
              onClick={() => {
                router.push("/help");
              }}
            >
              Contact Support
            </Link>
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
