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
  Image,
  RadioGroup,
  Radio,
  Textarea,
} from "@nextui-org/react";
import { UploadDropzone } from "../../utils/uploadthing";
import { useRouter } from "next/navigation";
import { FaInfoCircle } from "react-icons/fa";
import axios from "axios";

export default function DonorForm() {
    const [user,setUser]=useState("")
  const [donationName, setDonationName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [preparedTime, setPreparedTime] = useState("");
  const [expiryDateTime, setExpiryDateTime] = useState("");
  const [address, setAddress] = useState("");
  const [specialNote, setSpecialNote] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState("");
  const router = useRouter();

  const handleUploadComplete = (res) => {
    if (res && res.length > 0) {
      setImage(res[0].url);
    }
  };

  useEffect(()=>{
    const profile=async()=>{
        const {data}=await axios.get("/api/users/myprofile");
        setUser(data.user)
      }
      profile()
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      donor:user?._id,
      donationName,
      category,
      quantity,
      preparedTime,
      expiryDateTime,
      address,
      specialNote,
      type,
      image,
    };

    try {
      const response = await fetch("/api/donations/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit donation");
      }

      alert("Donation submitted successfully");
      router.push("/thank-you");
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
            <p className="text-small text-default-500">Donation Form</p>
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
              label="Donation Name"
              variant="bordered"
              description="Name your donation."
              value={donationName}
              onChange={(e) => setDonationName(e.target.value)}
              className="max-w-xs"
            />
            <RadioGroup
              label="Category"
              value={category}
              onValueChange={setCategory}
              className="max-w-xs"
            >
              <Radio value="veg">Veg</Radio>
              <Radio value="nonveg">Non-Veg</Radio>
              <Radio value="both">Both</Radio>
            </RadioGroup>
            <Input
              type="number"
              isRequired
              label="Quantity"
              variant="bordered"
              description="Enter the quantity."
              value={quantity}
              min={1}
              onChange={(e) => setQuantity(e.target.value)}
              className="max-w-xs"
            />
            <Input
              type="datetime-local"
              isRequired
              label="Prepared Time"
              variant="bordered"
              value={preparedTime}
              onChange={(e) => setPreparedTime(e.target.value)}
              className="max-w-xs"
            />
            <Input
              type="datetime-local"
              isRequired
              label="Expiry Date & Time"
              variant="bordered"
              value={expiryDateTime}
              onChange={(e) => setExpiryDateTime(e.target.value)}
              className="max-w-xs"
            />
            <Input
              isClearable
              isRequired
              label="Address"
              variant="bordered"
              description="Enter the address where the donation can be picked up."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="max-w-xs"
            />
            <Textarea
              label="Special Note"
              placeholder="Any special instructions?"
              variant="bordered"
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              className="max-w-xs"
            />
            <RadioGroup
              label="Type"
              value={type}
              onValueChange={setType}
              className="max-w-xs"
            >
              <Radio value="liquid">Liquid</Radio>
              <Radio value="solid">Solid</Radio>
            </RadioGroup>
            {image && (
              <div className="flex flex-col items-center mb-4">
                <Image
                  src={image}
                  alt="Donation Image"
                  className="rounded-md"
                  height={100}
                  width={100}
                />
                <Button
                  onClick={() => setImage("")}
                  className="mt-2"
                  size="sm"
                  color="danger"
                >
                  Change Image
                </Button>
              </div>
            )}
            <UploadDropzone
              endpoint="imageUploader"
              onClientUploadComplete={handleUploadComplete}
              onUploadError={(error) => alert(`ERROR! ${error.message}`)}
            />
            <Button color="primary" type="submit">
              Submit Donation
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
