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
    const categoryData = await prisma.product.groupBy({
      by: ['category'],
      _count: {
        category: true,
      },
    })

    const formattedCategoryData = categoryData.map((item) => ({
      name: item.category,
      value: item._count.category,
    }))

    return NextResponse.json(formattedCategoryData)
  } catch (error) {
    console.error('Error fetching category data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}