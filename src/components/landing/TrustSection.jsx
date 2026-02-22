import React from "react";

const trustPoints = [
  "Launch-boat delivery",
  "Transparent pricing",
  "Verified vendors",
  "Built for Singapore anchorage"
];

export default function TrustSection() {
  return (
    <section className="bg-[#EACEAA] py-16">
      <div className="max-w-[1200px] mx-auto px-8 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {trustPoints.map((point, index) => (
            <div key={index}>
              <p className="text-[13px] text-[#150C0C]/70 font-medium">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}