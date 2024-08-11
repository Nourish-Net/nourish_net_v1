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
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { FaInfoCircle } from "react-icons/fa";

export default function RideEdit() {
  const [user, setUser] = useState("");
  const [donation, setDonation] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [distanceTraveled, setDistanceTraveled] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [rideType, setRideType] = useState("delivery");
  const [product, setProduct] = useState("");
  const [notes, setNotes] = useState("");
  const router = useRouter();
  const { id } = useParams(); // Get the ride ID from the URL

  // Function to format date-time strings to `datetime-local` format
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchRideDetail = async () => {
      try {
        const { data } = await axios.get(`/api/rides/${id}`);
        const rideData = data.ride;
        setUser(rideData.user || "");
        setDonation(rideData.donation?.donor || "");
        setPickupLocation(rideData.pickupLocation || "");
        setDropoffLocation(rideData.dropoffLocation || "");
        setDistanceTraveled(rideData.distanceTraveled || "");
        setStartTime(formatDateTime(rideData.startTime));
        setEndTime(formatDateTime(rideData.endTime));
        setRideType(rideData.rideType || "delivery");
        setProduct(rideData.product || "");
        setNotes(rideData.notes || "");
      } catch (error) {
        console.error("Failed to fetch ride detail:", error);
      }
    };

    fetchRideDetail();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      user,
      donation,
      pickupLocation,
      dropoffLocation,
      distanceTraveled,
      startTime,
      endTime,
      rideType,
      product,
      notes,
    };

    try {
      const response = await axios.put(`/api/rides/${id}`, updatedData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.data.success) {
        throw new Error("Failed to update ride");
      }

      alert("Ride updated successfully");
      router.push(`/rides/${id}`);
    } catch (error) {
      console.error("Error:", error);
      alert("Update failed");
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
            <p className="text-md">Nourish Net</p>
            <p className="text-small text-default-500">Edit Ride</p>
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
              label="Donation ID"
              variant="bordered"
              description="Enter the Donation ID."
              value={donation}
              onChange={(e) => setDonation(e.target.value)}
              className="max-w-xs"
            />
            <Input
              isClearable
              isRequired
              label="Pickup Location"
              variant="bordered"
              description="Enter the pickup location."
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="max-w-xs"
            />
            <Input
              isClearable
              isRequired
              label="Dropoff Location"
              variant="bordered"
              description="Enter the dropoff location."
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
              className="max-w-xs"
            />
            <Input
              type="number"
              label="Distance Traveled (km)"
              variant="bordered"
              value={distanceTraveled}
              min={0}
              onChange={(e) => setDistanceTraveled(e.target.value)}
              className="max-w-xs"
            />
            <Input
              type="datetime-local"
              isRequired
              label="Start Time"
              variant="bordered"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="max-w-xs"
            />
            <Input
              type="datetime-local"
              label="End Time"
              variant="bordered"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="max-w-xs"
            />
            <RadioGroup
              label="Ride Type"
              value={rideType}
              onValueChange={setRideType}
              className="max-w-xs"
            >
              <Radio value="delivery">Delivery</Radio>
              <Radio value="pickup">Pickup</Radio>
            </RadioGroup>
            <Input
              isClearable
              isRequired
              label="Product Description"
              variant="bordered"
              description="Enter the product description."
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="max-w-xs"
            />
            <Textarea
              label="Notes"
              placeholder="Any special notes?"
              variant="bordered"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="max-w-xs"
            />
            <Button color="primary" type="submit">
              Update Ride
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
