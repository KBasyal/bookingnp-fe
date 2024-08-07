import React, { useEffect, useState } from "react";
import axiosInstance from "../../../config/axios.config";
import { LoadingComponent } from "../../common";


interface TeamMember {
    _id: string;
    name: string;
    position: string;
}

interface AboutData {
    map(arg0: (about: any) => import("react/jsx-runtime").JSX.Element): React.ReactNode;
    image?: string;
    title: string;
    content: string;
    team?: TeamMember[];
}


const About = () => {
    const [aboutData, setAboutData] = useState<AboutData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const response: any = await axiosInstance.get("/about"); // Adjust the endpoint as needed
                setAboutData(response.result);
                console.log("the response is::::", response.result)
            } catch (error) {
                console.error("Error fetching about data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAboutData();
    }, []);

    if (loading) {
        return <div><LoadingComponent /></div>;
    }

    if (!aboutData) {
        return <div>No data available</div>;
    }

    return (
        <section className="about-section py-8 px-4">
            <div className="container mx-auto max-w-screen-lg">
                {aboutData.map((about: any) => (<>
                    <div key={about._id} className="mb-8">
                        <img
                            src={`${import.meta.env.VITE_IMAGE_URL}/uploads/about/${about.image}`}
                            crossOrigin="anonymous"
                            alt="About"
                            className="w-full h-auto"
                        />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">{aboutData.title}</h2>
                    <p className="text-lg mb-6">{about.content}</p>

                    <div className="team-members">
                        <h3 className="text-2xl font-semibold mb-4">Meet Our Team</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {about.team.map((member:any) => (
                                <div key={member._id} className="team-member p-4 border rounded-lg shadow">
                                    <h4 className="text-xl font-semibold mb-2">{member.name}</h4>
                                    <p className="text-md text-gray-600">{member.position}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </>
                ))}
            </div>


        </section>
    );

};




export default About;
