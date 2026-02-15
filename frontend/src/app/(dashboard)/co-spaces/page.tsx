"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Plus, Users, ArrowRight } from "lucide-react";

interface CoSpace {
    id: string;
    name: string;
    description: string;
    member_count: number;
}

export default function CoSpacesPage() {
    const [loading, setLoading] = useState(true);
    const [coSpaces, setCoSpaces] = useState<CoSpace[]>([]);
    const [showCreate, setShowCreate] = useState(false);
    const [newSpaceName, setNewSpaceName] = useState("");
    const [newSpaceDesc, setNewSpaceDesc] = useState("");
    const [creating, setCreating] = useState(false);

    const fetchCoSpaces = async () => {
        try {
            setLoading(true);
            const response = await api.get("/co-spaces");
            setCoSpaces(response.data);
        } catch (error) {
            console.error("Failed to fetch co-spaces", error);
            // Mock data
            setCoSpaces([
                { id: "1", name: "Trip to Goa", description: "Friends trip fund", member_count: 5 },
                { id: "2", name: "Office Party", description: "Year end party", member_count: 12 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoSpaces();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setCreating(true);
            await api.post("/co-spaces", { name: newSpaceName, description: newSpaceDesc });
            toast.success("Co-space created successfully");
            setShowCreate(false);
            setNewSpaceName("");
            setNewSpaceDesc("");
            fetchCoSpaces();
        } catch (error) {
            console.error(error);
            toast.error("Failed to create co-space");
        } finally {
            setCreating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Co-Spaces</h2>
                    <p className="text-muted-foreground">Manage your collaborative funds.</p>
                </div>
                <Button onClick={() => setShowCreate(!showCreate)}>
                    {showCreate ? "Cancel" : <><Plus className="mr-2 h-4 w-4" /> Create Co-Space</>}
                </Button>
            </div>

            {showCreate && (
                <Card className="max-w-md animate-in fade-in slide-in-from-top-4">
                    <CardHeader>
                        <CardTitle>Create New Co-Space</CardTitle>
                        <CardDescription>Start a new shared fund with friends.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleCreate}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Summer Trip"
                                    value={newSpaceName}
                                    onChange={(e) => setNewSpaceName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="desc">Description</Label>
                                <Input
                                    id="desc"
                                    placeholder="Brief description"
                                    value={newSpaceDesc}
                                    onChange={(e) => setNewSpaceDesc(e.target.value)}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={creating} className="w-full">
                                {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {coSpaces.map((space) => (
                    <Card key={space.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                {space.name}
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardTitle>
                            <CardDescription>{space.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground">
                                {space.member_count} members
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button asChild variant="secondary" className="w-full">
                                <Link href={`/co-spaces/${space.id}`}>
                                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
                {coSpaces.length === 0 && !loading && (
                    <div className="col-span-full text-center py-10 text-muted-foreground">
                        No co-spaces found. Create one to get started!
                    </div>
                )}
            </div>
        </div>
    );
}
