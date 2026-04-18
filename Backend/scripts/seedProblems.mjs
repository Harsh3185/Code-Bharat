import path from "path";
import { fileURLToPath } from "url";

import dotenv from "dotenv";
import mongoose from "mongoose";

import { Problem } from "../src/Models/Problem.mjs";
import { TestCase } from "../src/Models/Testcase.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const MONGODB_URL = process.env.MONGODB_URL || process.env.MONGO_URI;
const CREATED_BY = process.env.SEED_CREATED_BY || "000000000000000000000001";

if (!MONGODB_URL) {
  throw new Error("MONGODB_URL is missing. Set it in Backend/.env or in the shell before running the seed.");
}

if (!mongoose.Types.ObjectId.isValid(CREATED_BY)) {
  throw new Error("SEED_CREATED_BY must be a valid MongoDB ObjectId when provided.");
}

const problems = [
  {
    problemNumber: 2,
    title: "Add Two Integers",
    statement: `You are given two integers a and b.

Your task is to compute their sum and print the result.

Input Format:
The first line contains integer a.
The second line contains integer b.

Output Format:
Print a single integer representing a + b.`,
    constraints: `-10^9 <= a, b <= 10^9`,
    examples: [
      { input: `2\n3`, output: `5`, explanation: `2 + 3 = 5.` },
      { input: `-4\n9`, output: `5`, explanation: `-4 + 9 = 5.` },
    ],
    testCases: [
      { input: `2\n3`, output: `5` },
      { input: `-4\n9`, output: `5` },
      { input: `1000000000\n1000000000`, output: `2000000000` },
      { input: `-7\n-8`, output: `-15` },
    ],
  },
  {
    problemNumber: 3,
    title: "Koko Eating Bananas",
    statement: `Koko has several piles of bananas. The i-th pile contains piles[i] bananas.

Koko chooses an eating speed k. Every hour, she picks exactly one pile and eats up to k bananas from that pile. If the pile has fewer than k bananas, she eats the whole pile in that hour.

She wants to finish all piles within h hours.

Find the minimum integer k such that Koko can eat all bananas within h hours.

Input Format:
The first line contains n, the number of piles.
The second line contains n space-separated integers representing piles.
The third line contains h.

Output Format:
Print the minimum possible eating speed.`,
    constraints: `1 <= n <= 10^5
1 <= piles[i] <= 10^9
1 <= h <= 10^9`,
    examples: [
      { input: `4\n3 6 7 11\n8`, output: `4`, explanation: `At speed 4, Koko finishes in 8 hours.` },
      { input: `5\n30 11 23 4 20\n5`, output: `30`, explanation: `Any smaller speed would require more than 5 hours.` },
    ],
    testCases: [
      { input: `4\n3 6 7 11\n8`, output: `4` },
      { input: `5\n30 11 23 4 20\n5`, output: `30` },
      { input: `5\n30 11 23 4 20\n6`, output: `23` },
      { input: `1\n100\n10`, output: `10` },
    ],
  },
  {
    problemNumber: 4,
    title: "Minimum Days to Make M Bouquets",
    statement: `You are given an array bloomDay where bloomDay[i] is the day on which the i-th flower blooms.

You want to make exactly m bouquets. To make one bouquet, you need k adjacent bloomed flowers.

Return the minimum number of days needed to make m bouquets. If it is impossible, print -1.

Input Format:
The first line contains n.
The second line contains n space-separated integers bloomDay[i].
The third line contains m and k.

Output Format:
Print the minimum day, or -1 if it cannot be done.`,
    constraints: `1 <= n <= 10^5
1 <= bloomDay[i] <= 10^9
1 <= m <= 10^6
1 <= k <= 10^5`,
    examples: [
      { input: `5\n1 10 3 10 2\n3 1`, output: `3`, explanation: `By day 3, three flowers have bloomed, so 3 bouquets can be made.` },
      { input: `5\n1 10 3 10 2\n3 2`, output: `-1`, explanation: `There are not enough adjacent bloomed flowers to make 3 bouquets.` },
    ],
    testCases: [
      { input: `5\n1 10 3 10 2\n3 1`, output: `3` },
      { input: `5\n1 10 3 10 2\n3 2`, output: `-1` },
      { input: `7\n7 7 7 7 12 7 7\n2 3`, output: `12` },
      { input: `8\n1 2 4 9 3 4 1 2\n2 2`, output: `2` },
    ],
  },
  {
    problemNumber: 5,
    title: "Find the Smallest Divisor Given a Threshold",
    statement: `You are given an array nums and an integer threshold.

Choose a positive integer divisor. For each number x in nums, compute ceil(x / divisor). Let the total sum of these values be S.

Find the smallest divisor such that S is less than or equal to threshold.

Input Format:
The first line contains n.
The second line contains n space-separated integers nums[i].
The third line contains threshold.

Output Format:
Print the smallest valid divisor.`,
    constraints: `1 <= n <= 5 * 10^4
1 <= nums[i] <= 10^6
n <= threshold <= 10^6`,
    examples: [
      { input: `4\n1 2 5 9\n6`, output: `5`, explanation: `Using divisor 5 gives 1 + 1 + 1 + 2 = 5.` },
      { input: `5\n44 22 33 11 1\n5`, output: `44`, explanation: `A very large divisor is needed to keep the sum within 5.` },
    ],
    testCases: [
      { input: `4\n1 2 5 9\n6`, output: `5` },
      { input: `5\n44 22 33 11 1\n5`, output: `44` },
      { input: `6\n2 3 5 7 11 13\n11`, output: `4` },
      { input: `3\n19 17 13\n10`, output: `7` },
    ],
  },
  {
    problemNumber: 6,
    title: "Capacity to Ship Packages Within D Days",
    statement: `You are given an array weights where weights[i] is the weight of the i-th package. Packages must be shipped in the given order.

Every day, you load packages onto a ship until adding the next package would exceed the ship capacity. Then that package must wait for the next day.

Find the minimum ship capacity needed to deliver all packages within exactly D days or fewer.

Input Format:
The first line contains n.
The second line contains n space-separated integers weights[i].
The third line contains D.

Output Format:
Print the minimum required capacity.`,
    constraints: `1 <= n <= 5 * 10^4
1 <= weights[i] <= 500
1 <= D <= n`,
    examples: [
      { input: `10\n1 2 3 4 5 6 7 8 9 10\n5`, output: `15`, explanation: `Capacity 15 allows all packages to be shipped in 5 days.` },
      { input: `6\n3 2 2 4 1 4\n3`, output: `6`, explanation: `Capacity 6 is the smallest valid answer.` },
    ],
    testCases: [
      { input: `10\n1 2 3 4 5 6 7 8 9 10\n5`, output: `15` },
      { input: `6\n3 2 2 4 1 4\n3`, output: `6` },
      { input: `5\n1 2 3 1 1\n4`, output: `3` },
      { input: `4\n10 50 100 100\n2`, output: `150` },
    ],
  },
  {
    problemNumber: 7,
    title: "K-th Missing Positive Number",
    statement: `You are given a strictly increasing array arr of positive integers and an integer k.

Find the k-th positive integer that does not appear in the array.

Input Format:
The first line contains n.
The second line contains n space-separated integers arr[i].
The third line contains k.

Output Format:
Print the k-th missing positive integer.`,
    constraints: `1 <= n <= 10^5
1 <= arr[i] <= 10^9
1 <= k <= 10^9`,
    examples: [
      { input: `5\n2 3 4 7 11\n5`, output: `9`, explanation: `The missing numbers are 1, 5, 6, 8, 9, ... so the 5th is 9.` },
      { input: `4\n1 2 3 4\n2`, output: `6`, explanation: `The missing numbers start from 5, so the 2nd is 6.` },
    ],
    testCases: [
      { input: `5\n2 3 4 7 11\n5`, output: `9` },
      { input: `4\n1 2 3 4\n2`, output: `6` },
      { input: `1\n2\n1`, output: `1` },
      { input: `3\n5 6 7\n4`, output: `4` },
    ],
  },
  {
    problemNumber: 8,
    title: "Longest Substring With At Most K Distinct Characters",
    statement: `Given a string s and an integer k, find the length of the longest contiguous substring that contains at most k distinct characters.

Input Format:
The first line contains the string s.
The second line contains k.

Output Format:
Print the maximum possible length.`,
    constraints: `1 <= s.length <= 2 * 10^5
0 <= k <= 26
s contains lowercase English letters`,
    examples: [
      { input: `eceba\n2`, output: `3`, explanation: `The substring "ece" has length 3 and contains 2 distinct characters.` },
      { input: `aa\n1`, output: `2`, explanation: `The whole string is valid.` },
    ],
    testCases: [
      { input: `eceba\n2`, output: `3` },
      { input: `aa\n1`, output: `2` },
      { input: `aabbcc\n2`, output: `4` },
      { input: `abcadcacacaca\n3`, output: `11` },
    ],
  },
  {
    problemNumber: 9,
    title: "Subarrays With K Different Integers",
    statement: `You are given an array nums and an integer k.

Count how many contiguous subarrays contain exactly k distinct integers.

Input Format:
The first line contains n.
The second line contains n space-separated integers nums[i].
The third line contains k.

Output Format:
Print the number of subarrays having exactly k distinct integers.`,
    constraints: `1 <= n <= 2 * 10^4
1 <= nums[i] <= n
1 <= k <= n`,
    examples: [
      { input: `5\n1 2 1 2 3\n2`, output: `7`, explanation: `There are 7 subarrays with exactly 2 distinct integers.` },
      { input: `5\n1 2 1 3 4\n3`, output: `3`, explanation: `The valid subarrays are [1,2,1,3], [2,1,3], and [1,3,4].` },
    ],
    testCases: [
      { input: `5\n1 2 1 2 3\n2`, output: `7` },
      { input: `5\n1 2 1 3 4\n3`, output: `3` },
      { input: `3\n1 1 1\n1`, output: `6` },
      { input: `6\n1 2 1 3 4 2\n2`, output: `6` },
    ],
  },
  {
    problemNumber: 10,
    title: "Minimum Window Substring",
    statement: `You are given two strings s and t.

Find the shortest substring of s that contains every character of t, including multiplicity. If no such substring exists, print an empty string.

Input Format:
The first line contains s.
The second line contains t.

Output Format:
Print the minimum window substring. If no valid window exists, print an empty line.`,
    constraints: `1 <= s.length, t.length <= 10^5
s and t consist of English letters`,
    examples: [
      { input: `ADOBECODEBANC\nABC`, output: `BANC`, explanation: `BANC is the shortest substring containing A, B, and C.` },
      { input: `a\naa`, output: ``, explanation: `It is impossible to cover both a characters.` },
    ],
    testCases: [
      { input: `ADOBECODEBANC\nABC`, output: `BANC` },
      { input: `a\naa`, output: `` },
      { input: `a\na`, output: `a` },
      { input: `ab\nb`, output: `b` },
    ],
  },
  {
    problemNumber: 11,
    title: "Word Ladder I",
    statement: `You are given a beginWord, an endWord, and a dictionary of valid words.

In one step, you may change exactly one character of the current word, and the new word must exist in the dictionary.

Return the minimum number of words in a valid transformation sequence from beginWord to endWord, including both beginWord and endWord. If it is impossible, print 0.

Input Format:
The first line contains beginWord.
The second line contains endWord.
The third line contains n, the size of the dictionary.
The fourth line contains n space-separated words.

Output Format:
Print the length of the shortest transformation sequence.`,
    constraints: `1 <= n <= 5000
All words have the same length
All words contain lowercase English letters`,
    examples: [
      { input: `hit\ncog\n6\nhot dot dog lot log cog`, output: `5`, explanation: `One shortest sequence is hit -> hot -> dot -> dog -> cog.` },
      { input: `hit\ncog\n5\nhot dot dog lot log`, output: `0`, explanation: `The endWord does not exist in the dictionary.` },
    ],
    testCases: [
      { input: `hit\ncog\n6\nhot dot dog lot log cog`, output: `5` },
      { input: `hit\ncog\n5\nhot dot dog lot log`, output: `0` },
      { input: `a\nc\n2\na c`, output: `2` },
      { input: `lost\ncost\n6\nmost fist lost cost fish host`, output: `2` },
    ],
  },
  {
    problemNumber: 12,
    title: "Course Schedule I",
    statement: `There are numCourses courses labeled from 0 to numCourses - 1.

You are given prerequisite pairs [a, b], meaning you must complete course b before course a.

Determine whether it is possible to finish all courses.

Input Format:
The first line contains numCourses.
The second line contains m, the number of prerequisite pairs.
The next m lines each contain two integers a and b.

Output Format:
Print true if all courses can be finished, otherwise print false.`,
    constraints: `1 <= numCourses <= 2000
0 <= m <= 5000
0 <= a, b < numCourses`,
    examples: [
      { input: `2\n1\n1 0`, output: `true`, explanation: `You can first take 0, then 1.` },
      { input: `2\n2\n1 0\n0 1`, output: `false`, explanation: `There is a cycle.` },
    ],
    testCases: [
      { input: `2\n1\n1 0`, output: `true` },
      { input: `2\n2\n1 0\n0 1`, output: `false` },
      { input: `4\n3\n1 0\n2 1\n3 2`, output: `true` },
      { input: `3\n3\n0 1\n1 2\n2 0`, output: `false` },
    ],
  },
  {
    problemNumber: 13,
    title: "Find Eventual Safe States",
    statement: `You are given a directed graph with n nodes numbered from 0 to n - 1.

A node is called safe if every possible path starting from that node eventually ends at a terminal node.

Return all safe nodes in increasing order.

Input Format:
The first line contains n.
For each of the next n lines:
The line starts with an integer len followed by len neighbors of node i.

Output Format:
Print the safe nodes in increasing order, space-separated.`,
    constraints: `1 <= n <= 10^4
0 <= total edges <= 4 * 10^4`,
    examples: [
      { input: `7\n2 1 2\n2 2 3\n1 5\n0\n1 5\n0\n0`, output: `2 3 4 5 6`, explanation: `These nodes cannot reach a cycle.` },
      { input: `4\n1 1\n1 2\n1 3\n0`, output: `0 1 2 3`, explanation: `There is no cycle in the graph.` },
    ],
    testCases: [
      { input: `7\n2 1 2\n2 2 3\n1 5\n0\n1 5\n0\n0`, output: `2 3 4 5 6` },
      { input: `4\n1 1\n1 2\n1 3\n0`, output: `0 1 2 3` },
      { input: `3\n1 1\n1 2\n1 1`, output: `` },
      { input: `5\n1 1\n1 2\n0\n1 4\n0`, output: `0 1 2 3 4` },
    ],
  },
  {
    problemNumber: 14,
    title: "Shortest Distance in a Binary Maze",
    statement: `You are given an n x m binary grid. A cell with value 1 can be visited, and a cell with value 0 is blocked.

You are also given a source cell and a destination cell.

Find the length of the shortest path from source to destination using moves in four directions. If the destination cannot be reached, print -1.

Input Format:
The first line contains n and m.
The next n lines contain m space-separated integers.
The next line contains sourceRow and sourceCol.
The last line contains destRow and destCol.

Output Format:
Print the length of the shortest path.`,
    constraints: `1 <= n, m <= 200
grid[i][j] is 0 or 1`,
    examples: [
      { input: `5 4\n1 1 1 1\n1 1 0 1\n1 1 1 1\n1 1 0 0\n1 0 0 1\n0 1\n2 2`, output: `3`, explanation: `A shortest path of length 3 exists.` },
      { input: `2 2\n1 0\n0 1\n0 0\n1 1`, output: `-1`, explanation: `The destination is unreachable.` },
    ],
    testCases: [
      { input: `5 4\n1 1 1 1\n1 1 0 1\n1 1 1 1\n1 1 0 0\n1 0 0 1\n0 1\n2 2`, output: `3` },
      { input: `2 2\n1 0\n0 1\n0 0\n1 1`, output: `-1` },
      { input: `3 3\n1 1 1\n0 1 0\n1 1 1\n0 0\n2 2`, output: `4` },
      { input: `1 1\n1\n0 0\n0 0`, output: `0` },
    ],
  },
  {
    problemNumber: 15,
    title: "Path With Minimum Effort",
    statement: `You are given an n x m grid heights where heights[i][j] represents the height of a cell.

A path's effort is defined as the maximum absolute difference in heights between two consecutive cells on that path.

Find the minimum effort required to travel from the top-left cell to the bottom-right cell.

Input Format:
The first line contains n and m.
The next n lines contain m space-separated integers heights[i][j].

Output Format:
Print the minimum effort needed.`,
    constraints: `1 <= n, m <= 100
1 <= heights[i][j] <= 10^6`,
    examples: [
      { input: `3 3\n1 2 2\n3 8 2\n5 3 5`, output: `2`, explanation: `There exists a path whose maximum step difference is 2.` },
      { input: `3 3\n1 2 3\n3 8 4\n5 3 5`, output: `1`, explanation: `A path with effort 1 exists.` },
    ],
    testCases: [
      { input: `3 3\n1 2 2\n3 8 2\n5 3 5`, output: `2` },
      { input: `3 3\n1 2 3\n3 8 4\n5 3 5`, output: `1` },
      { input: `5 5\n1 2 1 1 1\n1 2 1 2 1\n1 2 1 2 1\n1 2 1 2 1\n1 1 1 2 1`, output: `0` },
      { input: `1 1\n7`, output: `0` },
    ],
  },
  {
    problemNumber: 16,
    title: "Cheapest Flight Within K Stops",
    statement: `There are n cities labeled from 0 to n - 1 and a list of flights. Each flight is represented as (from, to, price).

You are given src, dst, and k.

Find the minimum cost to travel from src to dst using at most k stops. If it is impossible, print -1.

Input Format:
The first line contains n.
The second line contains m, the number of flights.
The next m lines each contain u v w.
The last line contains src, dst, and k.

Output Format:
Print the minimum cost.`,
    constraints: `1 <= n <= 100
0 <= m <= n * (n - 1)
0 <= price <= 10^4
0 <= k < n`,
    examples: [
      { input: `4\n5\n0 1 100\n1 2 100\n2 0 100\n1 3 600\n2 3 200\n0 3 1`, output: `700`, explanation: `The cheapest route with at most 1 stop is 0 -> 1 -> 3.` },
      { input: `3\n3\n0 1 100\n1 2 100\n0 2 500\n0 2 1`, output: `200`, explanation: `The route 0 -> 1 -> 2 is cheaper and valid.` },
    ],
    testCases: [
      { input: `4\n5\n0 1 100\n1 2 100\n2 0 100\n1 3 600\n2 3 200\n0 3 1`, output: `700` },
      { input: `3\n3\n0 1 100\n1 2 100\n0 2 500\n0 2 1`, output: `200` },
      { input: `3\n3\n0 1 100\n1 2 100\n0 2 500\n0 2 0`, output: `500` },
      { input: `5\n4\n0 1 5\n1 2 5\n2 3 5\n3 4 5\n0 4 2`, output: `-1` },
    ],
  },
  {
    problemNumber: 17,
    title: "Network Delay Time",
    statement: `You are given a directed weighted graph of n nodes numbered from 1 to n.

Each edge (u, v, w) means a signal can travel from u to v in time w.

A signal starts from node k. Find how long it takes for all nodes to receive the signal. If some node cannot be reached, print -1.

Input Format:
The first line contains n and m.
The next m lines each contain u v w.
The last line contains k.

Output Format:
Print the time needed for all nodes to receive the signal, or -1 if impossible.`,
    constraints: `1 <= n <= 100
1 <= m <= 6000
1 <= w <= 100`,
    examples: [
      { input: `4 3\n2 1 1\n2 3 1\n3 4 1\n2`, output: `2`, explanation: `The farthest node receives the signal in 2 units of time.` },
      { input: `2 1\n1 2 1\n2`, output: `-1`, explanation: `Node 1 is unreachable from node 2.` },
    ],
    testCases: [
      { input: `4 3\n2 1 1\n2 3 1\n3 4 1\n2`, output: `2` },
      { input: `2 1\n1 2 1\n2`, output: `-1` },
      { input: `3 3\n1 2 1\n2 3 2\n1 3 4\n1`, output: `3` },
      { input: `1 0\n1`, output: `0` },
    ],
  },
  {
    problemNumber: 18,
    title: "Number of Operations to Make Network Connected",
    statement: `There are n computers labeled from 0 to n - 1 and a list of direct cable connections.

You may remove any existing cable and reconnect it between any two computers.

Return the minimum number of operations needed to make the whole network connected. If it is impossible, print -1.

Input Format:
The first line contains n.
The second line contains m, the number of connections.
The next m lines each contain u and v.

Output Format:
Print the minimum number of operations, or -1 if impossible.`,
    constraints: `1 <= n <= 10^5
1 <= m <= 10^5
0 <= u, v < n`,
    examples: [
      { input: `4\n3\n0 1\n0 2\n1 2`, output: `1`, explanation: `One extra cable can be used to connect computer 3.` },
      { input: `6\n4\n0 1\n0 2\n0 3\n1 2`, output: `-1`, explanation: `Not enough cables exist to connect all components.` },
    ],
    testCases: [
      { input: `4\n3\n0 1\n0 2\n1 2`, output: `1` },
      { input: `6\n4\n0 1\n0 2\n0 3\n1 2`, output: `-1` },
      { input: `5\n4\n0 1\n0 2\n3 4\n2 3`, output: `0` },
      { input: `5\n6\n0 1\n0 2\n3 4\n2 3\n1 2\n0 4`, output: `0` },
    ],
  },
  {
    problemNumber: 19,
    title: "Making a Large Island",
    statement: `You are given an n x n binary grid where 1 means land and 0 means water.

You may change at most one water cell into land.

Return the size of the largest island possible after performing at most one change. An island is formed by connecting adjacent land cells in four directions.

Input Format:
The first line contains n.
The next n lines contain n space-separated integers.

Output Format:
Print the maximum island size.`,
    constraints: `1 <= n <= 500
grid[i][j] is 0 or 1`,
    examples: [
      { input: `2\n1 0\n0 1`, output: `3`, explanation: `Changing one of the water cells connects both land cells into one island of size 3.` },
      { input: `2\n1 1\n1 0`, output: `4`, explanation: `Changing the only 0 makes the whole grid one island.` },
    ],
    testCases: [
      { input: `2\n1 0\n0 1`, output: `3` },
      { input: `2\n1 1\n1 0`, output: `4` },
      { input: `2\n1 1\n1 1`, output: `4` },
      { input: `3\n1 0 1\n0 0 0\n1 0 1`, output: `3` },
    ],
  },
  {
    problemNumber: 20,
    title: "Coin Change II",
    statement: `You are given an integer amount and an array coins representing coin denominations.

Find the number of different combinations that can make up the amount. You have unlimited copies of each coin.

Two combinations are considered the same if they use the same counts of denominations, regardless of order.

Input Format:
The first line contains amount.
The second line contains n, the number of coin types.
The third line contains n space-separated integers coins[i].

Output Format:
Print the number of combinations.`,
    constraints: `0 <= amount <= 5000
1 <= n <= 300
1 <= coins[i] <= 5000`,
    examples: [
      { input: `5\n3\n1 2 5`, output: `4`, explanation: `The valid combinations are [5], [2,2,1], [2,1,1,1], [1,1,1,1,1].` },
      { input: `3\n2\n2 5`, output: `0`, explanation: `It is not possible to make amount 3.` },
    ],
    testCases: [
      { input: `5\n3\n1 2 5`, output: `4` },
      { input: `3\n2\n2 5`, output: `0` },
      { input: `10\n4\n2 3 5 6`, output: `5` },
      { input: `0\n3\n1 2 3`, output: `1` },
    ],
  },
  {
    problemNumber: 21,
    title: "Target Sum",
    statement: `You are given an array nums and an integer target.

Place either a '+' or '-' sign before every number and compute the final expression value.

Return the number of different ways to assign signs so that the expression equals target.

Input Format:
The first line contains n.
The second line contains n space-separated integers nums[i].
The third line contains target.

Output Format:
Print the total number of valid sign assignments.`,
    constraints: `1 <= n <= 20
0 <= nums[i] <= 1000
-1000 <= target <= 1000`,
    examples: [
      { input: `5\n1 1 1 1 1\n3`, output: `5`, explanation: `There are 5 different ways to reach target 3.` },
      { input: `1\n1\n1`, output: `1`, explanation: `Only +1 gives the target.` },
    ],
    testCases: [
      { input: `5\n1 1 1 1 1\n3`, output: `5` },
      { input: `1\n1\n1`, output: `1` },
      { input: `4\n1 2 1 2\n0`, output: `4` },
      { input: `3\n0 0 0\n0`, output: `8` },
    ],
  },
  {
    problemNumber: 22,
    title: "Edit Distance",
    statement: `Given two strings word1 and word2, find the minimum number of operations required to convert word1 into word2.

Allowed operations:
1. Insert a character
2. Delete a character
3. Replace a character

Input Format:
The first line contains word1.
The second line contains word2.

Output Format:
Print the minimum number of operations.`,
    constraints: `1 <= word1.length, word2.length <= 500`,
    examples: [
      { input: `horse\nros`, output: `3`, explanation: `horse -> rorse -> rose -> ros` },
      { input: `intention\nexecution`, output: `5`, explanation: `The minimum number of edits is 5.` },
    ],
    testCases: [
      { input: `horse\nros`, output: `3` },
      { input: `intention\nexecution`, output: `5` },
      { input: `abc\nabc`, output: `0` },
      { input: `kitten\nsitting`, output: `3` },
    ],
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URL);

  for (const problem of problems) {
    const existingProblems = await Problem.find({
      $or: [{ problemNumber: problem.problemNumber }, { title: problem.title }],
    }).select("_id");

    const existingIds = existingProblems.map((existingProblem) => existingProblem._id);

    if (existingIds.length > 0) {
      await TestCase.deleteMany({ problemId: { $in: existingIds } });
      await Problem.deleteMany({ _id: { $in: existingIds } });
    }

    const createdProblem = await Problem.create({
      problemNumber: problem.problemNumber,
      title: problem.title,
      statement: problem.statement.trim(),
      examples: problem.examples,
      constraints: problem.constraints.trim(),
      created_by: CREATED_BY,
    });

    await TestCase.insertMany(
      problem.testCases.map((testCase) => ({
        problemId: createdProblem._id,
        input: testCase.input,
        output: testCase.output,
      }))
    );

    console.log(`Seeded: ${problem.problemNumber} - ${problem.title}`);
  }

  console.log(`Done. Seeded ${problems.length} problems.`);
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
