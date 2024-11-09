import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/lib/auth'
import prisma from '@/app/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const salesData = await prisma.order.groupBy({
      by: ['createdAt'],
      _sum: {
        total: true
      },
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    const formattedSalesData = salesData.map(item => ({
      date: item.createdAt.toISOString().split('T')[0],
      sales: item._sum.total || 0
    }))

    return NextResponse.json(formattedSalesData)
  } catch (error) {
    console.error('Error fetching sales data:', error)
    return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}