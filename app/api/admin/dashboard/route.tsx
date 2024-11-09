import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [
      totalRevenue,
      totalOrders,
      totalUsers,
      lowStockProducts,
      recentOrders,
      salesData,
    ] = await Promise.all([
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.order.count(),
      prisma.user.count(),
      prisma.product.count({ where: { stockQuantity: { lt: 10 } } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, total: true, status: true, createdAt: true },
      }),
      prisma.$queryRaw`
        SELECT DATE_TRUNC('day', "createdAt") as date, SUM("total") as revenue
        FROM "Order"
        WHERE "createdAt" >= NOW() - INTERVAL '30 days'
        GROUP BY DATE_TRUNC('day', "createdAt")
        ORDER BY DATE_TRUNC('day', "createdAt")
      `,
    ]);

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.total || 0,
      totalOrders,
      totalUsers,
      lowStockProducts,
      recentOrders,
      salesData,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
